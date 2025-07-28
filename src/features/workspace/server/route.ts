import { db } from "@/db";
import { workspaceMember, workspace } from "@/db/schema/schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createWorkspaceSchema } from "@/zod-schemas/workspace-schema";
import { zValidator } from "@hono/zod-validator";
import { NeonDbError } from "@neondatabase/serverless";
import { Context, Hono } from "hono";
import { eq, inArray } from "drizzle-orm";
import { MemberRole } from "@/features/members/types/type";
import { generateInviteCode } from "@/lib/utils";
import { insertMemberSchemaType } from "@/zod-schemas/member-schema";
import { z } from "zod";
import { isBefore } from "date-fns";
import { auth } from "@/lib/auth";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user") as typeof auth.$Infer.Session.user | null;
    const session = c.get("session") as
      | typeof auth.$Infer.Session.session
      | null;
    if (!user || !session) {
      return c.json(
        { error: "Unauthorized", message: "User not authenticated" },
        401
      );
    }
    const members = await db
      .select()
      .from(workspaceMember)
      .where(eq(workspaceMember.userId, user.id));
    if (members.length === 0) {
      return c.json({ data: [] });
    }
    const workspacesIds = members.map((member) => member.workspaceId);
    const workspacesFound = await db
      .select()
      .from(workspace)
      .where(inArray(workspace.id, workspacesIds));
    return c.json({ data: workspacesFound });
  })
  .get("/:workspaceId", sessionMiddleware, async (c: Context) => {
    const userId = c.get("userId") as string;
    const workspaceId = c.req.param("workspaceId") as string;
    const members = await db
      .select()
      .from(workspaceMember)
      .where(eq(workspaceMember.userId, userId));
    if (members.length === 0) {
      return c.json(
        {
          error: "Forbidden",
          message: "You are not a member of this workspace",
        },
        403
      );
    }
    const workspacesIds = members.map((member) => member.workspaceId);
    const workspaceFound = await db
      .select()
      .from(workspace)
      .where(
        inArray(workspace.id, workspacesIds) && eq(workspace.id, workspaceId)
      );
    if (workspaceFound.length === 0) {
      return c.json(
        {
          error: "NotFound",
          message: "Workspace not found",
        },
        404
      );
    }
    return c.json({ data: workspaceFound[0] });
  })
  .get("/get-workspace-info/:workspaceId", sessionMiddleware, async (c) => {
    const workspaceId = c.req.param("workspaceId");
    try {
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
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const { name, image, description } = c.req.valid("form");
      let uploadedImage: string | undefined;

      if (image instanceof File) {
        try {
          const fileReader = await image.arrayBuffer();
          uploadedImage = `data:${image.type};base64,${Buffer.from(
            fileReader
          ).toString("base64")}`;
        } catch (err) {
          console.error("Error while processing image file", err);
          return c.json(
            {
              error: "InvalidImage",
              message: "Failed to process the image file",
            },
            400
          );
        }
      } else {
        uploadedImage = image || "";
      }
      const user = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!user) {
        return c.json({
          error: "Unauthorized",
          message: "User not authenticated",
        });
      }
      let newWorkspace;

      try {
        // Create the workspace
        [newWorkspace] = await db
          .insert(workspace)
          .values({
            id: crypto.randomUUID(),
            name,
            description: description.trim(),
            image: uploadedImage,
            creatorId: user.id,
            inviteCode: generateInviteCode(10),
          })
          .returning();

        try {
          // Create the member
          await db.insert(workspaceMember).values({
            id: crypto.randomUUID(),
            workspaceId: newWorkspace.id,
            userId: user.id,
            role: MemberRole.Admin,
          });
        } catch (err) {
          console.error("Error while creating member", err);

          // Rollback: Delete the created workspace
          await db.delete(workspace).where(eq(workspace.id, newWorkspace.id));

          return c.json(
            {
              error: "InternalServerError",
              message: "Failed to create member. Workspace rolled back.",
            },
            500
          );
        }

        return c.json({ data: newWorkspace }, 200);
      } catch (err) {
        console.error("ERROR WHILE CREATING WORKSPACE", err);

        if (err instanceof NeonDbError && err.code === "23505") {
          return c.json(
            { error: "Conflict", message: "Workspace already exists" },
            409
          );
        }

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
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const { name, image, description, id } = c.req.valid("form");
      const user = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!user) {
        return c.json({
          error: "Unauthorized",
          message: "User not authenticated",
        });
      }

      // Process the image
      let uploadedImage: string | "";
      if (image instanceof File) {
        try {
          const fileReader = await image.arrayBuffer();
          uploadedImage = `data:${image.type};base64,${Buffer.from(
            fileReader
          ).toString("base64")}`;
        } catch (err) {
          console.error("Error while processing image file", err);
          return c.json(
            {
              error: "InvalidImage",
              message: "Failed to process the image file",
            },
            400
          );
        }
      } else {
        uploadedImage = image || "";
      }
      try {
        const workspaceFound = await db
          .select()
          .from(workspace)
          .where(eq(workspace.id, id!))
          .then((results) => results[0]);

        if (!workspace) {
          return c.json(
            {
              error: "NotFound",
              message: "Workspace not found",
            },
            404
          );
        }

        if (workspaceFound.creatorId !== user.id) {
          return c.json(
            {
              error: "Forbidden",
              message: "You are not authorized to update this workspace",
            },
            403
          );
        }

        // Update the workspace
        const updatedWorkspace = await db
          .update(workspace)
          .set({
            name: name.trim(),
            description: description.trim(),
            image: uploadedImage,
          })
          .where(eq(workspace.id, id!))
          .returning()
          .then((results) => results[0]);

        if (!updatedWorkspace) {
          return c.json(
            {
              error: "InternalServerError",
              message: "Failed to update the workspace",
            },
            500
          );
        }

        return c.json({ data: updatedWorkspace });
      } catch (err) {
        console.error("Error while updating workspace", err);
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
    const user = c.get("user") as typeof auth.$Infer.Session.user | null;
    if (!user) {
      return c.json(
        { error: "Unauthorized", message: "User not authenticated" },
        401
      );
    }
    const workSpaceId = c.req.param("workspaceId") as string;
    // Fetch the members
    let membersFound: insertMemberSchemaType[] = [];
    try {
      const members = await db
        .select()
        .from(workspaceMember)
        .where(eq(workspaceMember.workspaceId, workSpaceId));
      if (members.length === 0) {
        return c.json(
          {
            error: "Forbidden",
            message: "You are not a member of this workspace",
          },
          403
        );
      }
      membersFound = members;
    } catch (error) {
      console.log("Error while deleting", error);
      return c.json(
        {
          error: "InternalServerError",
          message: "Internal server error",
        },
        500
      );
    }
    //select the workspace
    try {
      const workspaceFound = await db
        .select()
        .from(workspace)
        .where(eq(workspace.id, workSpaceId));
      if (workspaceFound.length === 0) {
        return c.json(
          {
            error: "NotFound",
            message: "Workspace not found",
          },
          404
        );
      }
      const currentWorkSpaceFromMembersFound = membersFound.find(
        (member) => member.workspaceId === workSpaceId
      );
      if (
        workspaceFound[0].creatorId !== user.id ||
        currentWorkSpaceFromMembersFound?.role !== MemberRole.Admin
      ) {
        return c.json(
          {
            error: "Unauthorized",
            message: "You can not delete others",
          },
          403
        );
      }
    } catch (error) {
      console.log(error);
      return c.json(
        {
          error: "InternalServerError",
          message: "Internal server error",
        },
        500
      );
    }
    //delete workspace
    try {
      await db.delete(workspace).where(eq(workspace.id, workSpaceId));
    } catch (error) {
      console.log(error);
      return c.json(
        {
          error: "InternalServerError",
          message: "Internal server error",
        },
        500
      );
    }
    //delete all members
    try {
      await db
        .delete(workspaceMember)
        .where(eq(workspaceMember.workspaceId, workSpaceId));
    } catch (error) {
      console.log(error);
      return c.json(
        {
          error: "InternalServerError",
          message: "Internal server error",
        },
        500
      );
    }
    return c.json({ data: "Workspace deleted" });
  })
  .patch("/:workspaceId/invite-code", sessionMiddleware, async (c) => {
    const user = c.get("user") as typeof auth.$Infer.Session.user | null;
    if (!user) {
      return c.json(
        { error: "Unauthorized", message: "User not authenticated" },
        401
      );
    }
    const workSpaceId = c.req.param("workspaceId") as string;
    // Fetch the members
    let membersFound: insertMemberSchemaType[] = [];
    try {
      const members = await db
        .select()
        .from(workspaceMember)
        .where(eq(workspaceMember.workspaceId, workSpaceId));
      if (members.length === 0) {
        return c.json(
          {
            error: "Forbidden",
            message: "You are not a member of this workspace",
          },
          403
        );
      }
      membersFound = members;
    } catch (error) {
      console.log("Error while deleting", error);
      return c.json(
        {
          error: "InternalServerError",
          message: "Internal server error",
        },
        500
      );
    }
    //select the workspace
    try {
      const workspaceFound = await db
        .select()
        .from(workspace)
        .where(eq(workspace.id, workSpaceId));
      if (workspaceFound.length === 0) {
        return c.json(
          {
            error: "NotFound",
            message: "Workspace not found",
          },
          404
        );
      }
      const currentWorkSpaceFromMembersFound = membersFound.find(
        (member) => member.workspaceId === workSpaceId
      );
      if (
        workspaceFound[0].creatorId !== user.id ||
        currentWorkSpaceFromMembersFound?.role !== MemberRole.Admin
      ) {
        return c.json(
          {
            error: "Unauthorized",
            message: "You can not delete others",
          },
          403
        );
      }
    } catch (error) {
      console.log(error);
      return c.json(
        {
          error: "InternalServerError",
          message: "",
        },
        500
      );
    }
    //update the workspace invite code
    let inviteCode: string;
    try {
      inviteCode = generateInviteCode(10);
      await db
        .update(workspace)
        .set({
          inviteCode,
          inviteCodeExpire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .where(eq(workspace.id, workSpaceId));
    } catch (error) {
      console.log(error);
      return c.json(
        {
          error: "InternalServerError",
          message: "Internal server error",
        },
        500
      );
    }
    return c.json({ data: inviteCode }, 200);
  })
  .post(
    "/:workspaceId/join",
    zValidator(
      "json",
      z.object({ inviteCode: z.string().nonempty("invite code required") })
    ),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!user) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }
      const { inviteCode } = c.req.valid("json");
      const workspaceId = c.req.param("workspaceId") as string;
      //check the invite code is correct
      let workspaceFound;
      try {
        workspaceFound = await db
          .select()
          .from(workspace)
          .where(
            eq(workspace.id, workspaceId) &&
              eq(workspace.inviteCode, inviteCode)
          );
        if (workspaceFound.length === 0) {
          return c.json(
            {
              error: "NotFound",
              message: "Workspace not found",
            },
            404
          );
        }
        const { inviteCodeExpire } = workspaceFound[0];
        if (
          inviteCodeExpire &&
          isBefore(new Date(inviteCodeExpire), new Date())
        ) {
          return c.json(
            { error: "Expired", message: "Invitation link has expired" },
            410
          );
        }
        //check if the user is already a member else add the user
        const membersFound = await db
          .select()
          .from(workspaceMember)
          .where(
            eq(workspaceMember.workspaceId, workspaceId) &&
              eq(workspaceMember.userId, user.id)
          );
        if (membersFound.length > 0) {
          return c.json(
            {
              error: "Conflict",
              message: "You are allready a member of this workspace",
            },
            409
          );
        }
        try {
          await db.insert(workspaceMember).values({
            workspaceId,
            userId: user.id,
            role: MemberRole.Member,
            id: crypto.randomUUID(),
          });
        } catch (error) {
          console.log("Error while adding member", error);
          return c.json(
            {
              error: "InternalServerError",
              message: "Error failed to join workspace",
            },
            500
          );
        }
        return c.json({ data: "User joined workspace" });
      } catch (error) {
        console.log("Error while checking the workspace", error);
        return c.json(
          {
            error: "InternalServerError",
            message: "Error failed to join workspace",
          },
          500
        );
      }
    }
  );

export default app;
