import { db } from "../../..";
import { workspaceMember, workspace, user } from "@/db/schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createWorkspaceSchema } from "@/features/workspace/validators/create-workspace";
import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { and, eq, gt, inArray } from "drizzle-orm";
import { MemberRole } from "@/features/members/types/type";
import { generateInviteCode } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { updateWorkspaceSchema } from "../validators/update-workspace";
import { joinWorkspaceSchema } from "../validators/join-workspace";

const app = new Hono()
  .get("/user-workspaces", sessionMiddleware, async (c) => {
    try {
      const userFound = c.get("user") as typeof auth.$Infer.Session.user | null;
      const session = c.get("session") as
        | typeof auth.$Infer.Session.session
        | null;
      if (!userFound || !session) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }
      const userWorkspaces = await db
        .select()
        .from(workspaceMember)
        .where(eq(workspaceMember.userId, userFound.id));
      if (userWorkspaces.length === 0) {
        return c.json(
          { error: "NotFound", message: "No workspaces found with the user" },
          404
        );
      }
      const workspacesIds = userWorkspaces.map((member) => member.workspaceId);
      const workspacesFound = await db
        .select()
        .from(workspace)
        .where(inArray(workspace.id, workspacesIds));
      const workspacesWithUserInfo = workspacesFound.map((workspace) => {
        const member = userWorkspaces.find(
          (m) => m.workspaceId === workspace.id
        );
        return {
          ...workspace,
          member: member,
        };
      });
      return c.json(
        {
          data: workspacesWithUserInfo,
          message: "Workspaces fetched successfully",
        },
        200
      );
    } catch (error) {
      console.log("Error in user-workspaces route:", error);
      return c.json(
        {
          error: "InternalServerError",
          message: "An error occurred while processing your request",
        },
        500
      );
    }
  })
  .get("/:workspaceId", sessionMiddleware, async (c: Context) => {
    try {
      const userFound = c.get("user") as typeof auth.$Infer.Session.user | null;
      const session = c.get("session") as
        | typeof auth.$Infer.Session.session
        | null;
      if (!userFound || !session) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }
      const workspaceId = c.req.param("workspaceId") as string;
      const userWorkspace = await db
        .select()
        .from(workspaceMember)
        .where(
          and(
            eq(workspaceMember.userId, userFound.id),
            eq(workspaceMember.workspaceId, workspaceId)
          )
        );
      if (userWorkspace.length === 0) {
        return c.json(
          {
            error: "Forbidden",
            message: "You are not a member of this workspace",
          },
          403
        );
      }
      const workspaceFound = await db
        .select()
        .from(workspace)
        .where(eq(workspace.id, workspaceId));
      const workspaceWithMemberInfo = {
        ...workspaceFound[0],
        member: userWorkspace,
      };
      return c.json(
        {
          data: workspaceWithMemberInfo,
          message: "Workspace fetched successfully",
        },
        200
      );
    } catch (error) {
      console.error("Error in workspace route:", error);
      return c.json(
        {
          error: "InternalServerError",
          message: "An error occurred while processing your request",
        },
        500
      );
    }
  })
  .get("/get-workspace-info/:workspaceId", sessionMiddleware, async (c) => {
    try {
      const userFound = c.get("user") as typeof auth.$Infer.Session.user | null;
      const session = c.get("session") as
        | typeof auth.$Infer.Session.session
        | null;
      if (!userFound || !session) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }
      const workspaceId = c.req.param("workspaceId");
      const workspaceFound = await db
        .select()
        .from(workspace)
        .where(eq(workspace.id, workspaceId));
      if (workspaceFound.length === 0) {
        return c.json(
          {
            error: "NotFound",
            message: "Workspace not found",
          },
          404
        );
      }
      return c.json({
        data: { name: workspaceFound[0].name, image: workspaceFound[0].image },
      });
    } catch (error) {
      console.log("Error while fetching workspace information", error);
      return c.json(
        {
          error: "InternalServerError",
          message: "Failed to fetch workspace information",
        },
        500
      );
    }
  })
  .post(
    "/",
    zValidator("json", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      try {
        const userFound = c.get("user") as
          | typeof auth.$Infer.Session.user
          | null;
        const session = c.get("session") as
          | typeof auth.$Infer.Session.session
          | null;
        if (!userFound || !session) {
          return c.json(
            {
              error: "Unauthorized",
              message: "User not authenticated",
            },
            401
          );
        }
        const { name, image, description } = c.req.valid("json");

        const existingWorkspace = await db
          .select()
          .from(workspace)
          .where(eq(workspace.name, name.trim()));
        if (existingWorkspace.length > 0) {
          return c.json(
            {
              error: "Conflict",
              message: "Workspace with this name already exists",
            },
            409
          );
        }

        const newWorkspace = await db
          .insert(workspace)
          .values({
            id: crypto.randomUUID(),
            name: name.trim(),
            description: description.trim(),
            image: image,
            creatorId: userFound.id,
            inviteCode: generateInviteCode(10),
          })
          .returning();

        const newWorkspaceMember = await db
          .insert(workspaceMember)
          .values({
            id: crypto.randomUUID(),
            workspaceId: newWorkspace[0].id,
            userId: userFound.id,
            role: MemberRole.Admin,
          })
          .returning();

        await db
          .update(user)
          .set({
            lastWorkspaceId: newWorkspace[0].id,
          })
          .where(eq(user.id, userFound.id));

        return c.json(
          {
            data: {
              workspace: newWorkspace[0],
              member: newWorkspaceMember[0],
            },
            message: "Workspace created successfully",
          },
          201
        );
      } catch (error) {
        console.error("Error while creating workspace:", error);
        return c.json(
          {
            error: "InternalServerError",
            message: "Failed to create workspace",
          },
          500
        );
      }
    }
  )
  .patch(
    "/",
    zValidator("json", updateWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      try {
        const userFound = c.get("user") as
          | typeof auth.$Infer.Session.user
          | null;
        const session = c.get("session") as
          | typeof auth.$Infer.Session.session
          | null;
        if (!userFound || !session) {
          return c.json(
            {
              error: "Unauthorized",
              message: "User not authenticated",
            },
            401
          );
        }
        const { name, image, description, id } = c.req.valid("json");
        const currentUserPermission = await db
          .select()
          .from(workspaceMember)
          .where(
            and(
              eq(workspaceMember.workspaceId, id),
              eq(workspaceMember.userId, userFound.id),
              eq(workspaceMember.role, MemberRole.Admin)
            )
          );

        if (currentUserPermission.length === 0) {
          return c.json(
            {
              error: "Forbidden",
              message: "You do not have permission to update this workspace",
            },
            403
          );
        }

        const updatedWorkspace = await db
          .update(workspace)
          .set({
            name: name.trim(),
            description: description.trim(),
            image: image,
          })
          .where(eq(workspace.id, id))
          .returning();

        return c.json(
          {
            data: updatedWorkspace[0],
            message: "Workspace updated successfully",
          },
          200
        );
      } catch (error) {
        console.error("Error while updating workspace", error);
        return c.json(
          {
            error: "InternalServerError",
            message: "Failed to update the workspace",
          },
          500
        );
      }
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    try {
      const userFound = c.get("user") as typeof auth.$Infer.Session.user | null;
      const session = c.get("session") as
        | typeof auth.$Infer.Session.session
        | null;
      if (!userFound || !session) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }
      const workspaceId = c.req.param("workspaceId") as string;
      const currentMemberPermission = await db
        .select()
        .from(workspaceMember)
        .where(
          and(
            eq(workspaceMember.userId, userFound.id),
            (eq(workspaceMember.workspaceId, workspaceId),
            eq(workspaceMember.role, MemberRole.Admin))
          )
        );

      if (currentMemberPermission.length === 0) {
        return c.json(
          {
            error: "Forbidden",
            message: "You do not have permission to delete this workspace",
          },
          403
        );
      }

      await db
        .update(user)
        .set({
          lastWorkspaceId: null,
          lastProjectId: null,
        })
        .where(eq(user.id, userFound.id));

      const deletedWorkspace = await db
        .delete(workspace)
        .where(eq(workspace.id, workspaceId))
        .returning();

      return c.json(
        {
          data: deletedWorkspace[0],
          message: "Workspace deleted successfully",
        },
        200
      );
    } catch (error) {
      console.error("Error while deleting workspace", error);
      return c.json(
        {
          error: "InternalServerError",
          message: "Failed to delete the workspace",
        },
        500
      );
    }
  })
  .patch("/:workspaceId/invite-code", sessionMiddleware, async (c) => {
    try {
      const userFound = c.get("user") as typeof auth.$Infer.Session.user | null;
      const session = c.get("session") as
        | typeof auth.$Infer.Session.session
        | null;
      if (!userFound || !session) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }

      const workSpaceId = c.req.param("workspaceId") as string;
      const currentMemberPermission = await db
        .select()
        .from(workspaceMember)
        .where(
          and(
            eq(workspaceMember.userId, userFound.id),
            eq(workspaceMember.workspaceId, workSpaceId),
            eq(workspaceMember.role, MemberRole.Admin)
          )
        );

      if (currentMemberPermission.length === 0) {
        return c.json(
          {
            error: "Forbidden",
            message: "You do not have permission to update this workspace",
          },
          403
        );
      }

      const updatedWorkspace = await db
        .update(workspace)
        .set({
          inviteCode: generateInviteCode(10),
          inviteCodeExpire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .where(eq(workspace.id, workSpaceId))
        .returning();

      return c.json(
        {
          data: updatedWorkspace[0],
          message: "Workspace invite code updated successfully",
        },
        200
      );
    } catch (error) {
      console.error("Error while updating workspace invite code", error);
      return c.json(
        {
          error: "InternalServerError",
          message: "Failed to update the workspace invite code",
        },
        500
      );
    }
  })
  .post(
    "/workspace/join",
    zValidator("json", joinWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      try {
        const userFound = c.get("user") as
          | typeof auth.$Infer.Session.user
          | null;
        const session = c.get("session") as
          | typeof auth.$Infer.Session.session
          | null;
        if (!userFound || !session) {
          return c.json(
            { error: "Unauthorized", message: "User not authenticated" },
            401
          );
        }
        const { inviteCode, workspaceId } = c.req.valid("json");

        const currentWorkspace = await db
          .select()
          .from(workspace)
          .where(
            and(
              eq(workspace.id, workspaceId),
              eq(workspace.inviteCode, inviteCode),
              gt(workspace.inviteCodeExpire, new Date())
            )
          );
        if (currentWorkspace.length === 0) {
          return c.json(
            {
              error: "NotFound",
              message: "Workspace not found or invite code is invalid",
            },
            404
          );
        }

        const userAlreadyMember = await db
          .select()
          .from(workspaceMember)
          .where(
            and(
              eq(workspaceMember.workspaceId, workspaceId),
              eq(workspaceMember.userId, userFound.id)
            )
          );
        if (userAlreadyMember.length > 0) {
          return c.json(
            {
              error: "Conflict",
              message: "You are already a member of this workspace",
            },
            409
          );
        }

        const newWorkspaceMember = await db
          .insert(workspaceMember)
          .values({
            workspaceId,
            userId: userFound.id,
            role: MemberRole.Member,
            id: crypto.randomUUID(),
          })
          .returning();

        await db
          .update(user)
          .set({
            lastWorkspaceId: workspaceId,
          })
          .where(eq(user.id, userFound.id));

        return c.json(
          {
            data: {
              newWorkspaceMember: newWorkspaceMember[0],
            },
            message: "User joined workspace successfully",
          },
          200
        );
      } catch (error) {
        console.error("Error while joining workspace", error);
        return c.json(
          {
            error: "InternalServerError",
            message: "Failed to join workspace",
          },
          500
        );
      }
    }
  );

export default app;
