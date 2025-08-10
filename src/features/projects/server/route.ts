import { db } from "@/db";
import {
  project,
  projectMember,
  user,
  workspaceMember,
} from "@/db/schema/schema";
import { auth } from "@/lib/auth";
import { sessionMiddleware } from "@/lib/session-middleware";

import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, notInArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { createProjectSchema } from "../validators/create-project";
import { MemberRole } from "@/features/members/types/type";
import { updateProjectSchema } from "../validators/update-project";

const app = new Hono()
  .get("/user-projects", sessionMiddleware, async (c) => {
    try {
      const userFound = c.get("user") as typeof auth.$Infer.Session.user | null;
      const session = c.get("session") as typeof auth.$Infer.Session | null;
      if (!userFound || !session) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }
      const workspaceMembersFound = await db
        .select()
        .from(workspaceMember)
        .where(
          and(
            eq(workspaceMember.workspaceId, userFound.lastWorkspaceId),
            eq(workspaceMember.userId, userFound.id)
          )
        );
      if (workspaceMembersFound.length === 0) {
        return c.json({
          error: "Unauthorized",
          message: "Unauthorized, you can't access this workspace",
        });
      }
      const projectMemberFound = await db
        .select()
        .from(projectMember)
        .where(eq(projectMember.userId, userFound.id));

      if (projectMemberFound.length === 0) {
        return c.json(
          {
            error: "BadRequest",
            message: "User is not a member of any project",
          },
          400
        );
      }
      const projectMemberIds = projectMemberFound.map(
        (projectMember) => projectMember.projectId
      );

      const projectFound = await db
        .select()
        .from(project)
        .where(
          and(
            eq(project.workspaceId, userFound.lastWorkspaceId),
            inArray(project.id, projectMemberIds)
          )
        );

      const dataSend = projectFound.map((project) => {
        return {
          project,
          member: projectMemberFound.find(
            (member) => member.projectId === project.id
          ),
        };
      });
      return c.json(
        { data: dataSend, message: "Projects fetched successfully" },
        200
      );
    } catch (error) {
      console.error("Error while fetching projects", error);
      return c.json(
        {
          error: "FailedToFetchProjects",
          message: "Failed to fetch projects",
        },
        500
      );
    }
  })
  .get(
    "/single/:projectId",
    sessionMiddleware,
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const projectId = c.req.param("projectId");
      try {
        const projectFound = await db
          .select()
          .from(project)
          .where(eq(project.id, projectId));
        if (projectFound.length === 0) {
          return c.json(
            { error: "ProjectNotFound", message: "Project not found" },
            404
          );
        }
        return c.json({ data: projectFound[0] });
      } catch (error) {
        console.error("Error while fetching project", error);
        return c.json(
          {
            error: "FailedToFetchProject",
            message: "Failed to fetch project",
          },
          500
        );
      }
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createProjectSchema),
    async (c) => {
      try {
        const userFound = c.get("user") as
          | typeof auth.$Infer.Session.user
          | null;

        const session = c.get("session") as typeof auth.$Infer.Session | null;
        if (!userFound || !session) {
          return c.json(
            { error: "Unauthorized", message: "User not authenticated" },
            401
          );
        }
        const { name, description, image, isPrivate } = c.req.valid("json");
        if (!name || !description) {
          return c.json(
            {
              error: "Bad Request",
              message: "Name and description are required",
            },
            400
          );
        }

        const result = await db.transaction(
          async (tx) => {
            const workspaceMemberFound = await tx
              .select()
              .from(workspaceMember)
              .where(
                and(
                  eq(workspaceMember.workspaceId, userFound.lastWorkspaceId),
                  eq(workspaceMember.userId, userFound.id),
                  eq(workspaceMember.role, MemberRole.Admin)
                )
              );

            if (workspaceMemberFound.length === 0) {
              throw new Error("User is not an admin of this workspace");
            }

            let inviteCode;
            if (isPrivate) {
              inviteCode = Math.random().toString(36).substring(2, 8);
            }

            // Insert new project
            const newProject = await tx
              .insert(project)
              .values({
                id: crypto.randomUUID(),
                name,
                description,
                workspaceId: userFound.lastWorkspaceId,
                image: image,
                creatorId: userFound.id,
                isPrivate,
                inviteCode,
              })
              .returning();
            // Update user's last project ID
            await tx
              .update(user)
              .set({
                lastProjectId: newProject[0].id,
              })
              .where(eq(user.id, userFound.id));
            // Insert project member
            const newProjectMember = await tx
              .insert(projectMember)
              .values({
                id: crypto.randomUUID(),
                projectId: newProject[0].id,
                role: MemberRole.Admin,
                userId: userFound.id,
              })
              .returning();

            return {
              project: newProject[0],
              projectMember: newProjectMember[0],
            };
          },
          {
            isolationLevel: "serializable",
            accessMode: "read write",
          }
        );

        return c.json(
          {
            message: "Project created successfully",
            data: {
              project: result.project,
              projectMember: result.projectMember,
            },
          },
          201
        );
      } catch (error) {
        console.error("Error while creating project:", error);
        return c.json(
          {
            error: "FailedToCreateProject",
            message:
              error instanceof Error
                ? error.message
                : "Failed to create project",
          },
          error instanceof Error &&
            error.message.includes("User is not an admin")
            ? 401
            : 500
        );
      }
    }
  )
  .patch(
    "/",
    sessionMiddleware,
    zValidator("json", updateProjectSchema),
    async (c) => {
      try {
        const userFound = c.get("user") as
          | typeof auth.$Infer.Session.user
          | null;
        const session = c.get("session") as typeof auth.$Infer.Session | null;
        if (!userFound || !session) {
          return c.json(
            { error: "Unauthorized", message: "User not authenticated" },
            401
          );
        }
        const { name, description, image, isPrivate } = c.req.valid("json");
        if (!name || !description) {
          return c.json(
            {
              error: "BadRequest",
              message: "Name, description, and ID are required",
            },
            400
          );
        }
        let inviteCode: string;
        if (isPrivate) {
          inviteCode = Math.random().toString(36).substring(2, 8);
        }
        const result = await db.transaction(
          async (tx) => {
            const workspaceMemberFound = await tx
              .select()
              .from(projectMember)
              .where(
                and(
                  eq(projectMember.projectId, userFound.lastProjectId),
                  eq(projectMember.userId, userFound.id),
                  eq(projectMember.role, MemberRole.Admin)
                )
              );
            if (workspaceMemberFound.length === 0) {
              throw new Error(
                "You dont have permission to update this project"
              );
            }
            const currentProject = await tx
              .select()
              .from(project)
              .where(eq(project.id, userFound.lastProjectId));

            if (currentProject.length === 0) {
              throw new Error("Project not found");
            }
            const updatedProject = await tx
              .update(project)
              .set({
                name,
                description,
                image,
                creatorId: userFound.id,
                inviteCode,
                isPrivate,
              })
              .where(eq(project.id, userFound.lastProjectId))
              .returning();
            return {
              project: updatedProject[0],
            };
          },
          {
            isolationLevel: "serializable",
            accessMode: "read write",
          }
        );
        return c.json(
          { data: result.project, message: "Project updated successfully" },
          200
        );
      } catch (error) {
        console.error("Error while updating project:", error);
        return c.json(
          {
            error: "FailedToUpdateProject",
            message:
              error instanceof Error &&
              error.message ===
                "You dont have permission to update this project"
                ? "You dont have permission to update this project"
                : error instanceof Error &&
                    error.message === "Project not found"
                  ? "Project not found"
                  : "Failed to update project",
          },
          error instanceof Error &&
            error.message === "You dont have permission to update this project"
            ? 401
            : error instanceof Error && error.message === "Project not found"
              ? 404
              : 500
        );
      }
    }
  )
  .delete(
    "/:projectId",
    sessionMiddleware,
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const projectId = c.req.param("projectId");
      try {
        await db.delete(project).where(eq(project.id, projectId));
        return c.json({ data: "Project deleted successfully" }, 200);
      } catch (error) {
        console.error("Error while deleting project", error);
        return c.json(
          {
            error: "FailedToDeleteProject",
            message: "Failed to delete project",
          },
          500
        );
      }
    }
  )
  .get(
    "/add-project-member/:projectId/:workspaceId",
    sessionMiddleware,
    zValidator(
      "param",
      z.object({ projectId: z.string(), workspaceId: z.string() })
    ),
    async (c) => {
      const { projectId, workspaceId } = c.req.valid("param");
      const userFound = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!userFound) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }

      try {
        const workspaceMembersFound = await db
          .select()
          .from(workspaceMember)
          .where(
            and(
              eq(workspaceMember.workspaceId, workspaceId),
              eq(workspaceMember.userId, userFound.id)
            )
          );

        if (workspaceMembersFound.length === 0) {
          return c.json(
            {
              error: "Unauthorized",
              message:
                "Unauthorized, you should be a member of this workspace to add project member",
            },
            401
          );
        }
        const projectMembersFound = await db
          .select()
          .from(projectMember)
          .where(
            and(
              eq(projectMember.projectId, projectId),
              eq(projectMember.role, "admin"),
              eq(projectMember.userId, userFound.id)
            )
          );
        if (projectMembersFound.length === 0) {
          return c.json(
            {
              error: "Unauthorized",
              message: "Unauthorized, you can't add project member",
            },
            401
          );
        }

        // Get all project members for the project
        const projectMembers = await db
          .select({ userId: projectMember.userId })
          .from(projectMember)
          .where(eq(projectMember.projectId, projectId));

        const projectMembersIds = projectMembers.map((member) => member.userId);
        // Get workspace members which are not in the project members
        const validWorkspaceMembersToBeInvited = await db
          .select()
          .from(workspaceMember)
          .where(
            and(
              eq(workspaceMember.workspaceId, workspaceId),
              projectMembersIds.length > 0
                ? notInArray(workspaceMember.userId, projectMembersIds)
                : undefined
            )
          );

        const validWorkspaceMembersIds = validWorkspaceMembersToBeInvited.map(
          (member) => member.userId
        );

        const validUsersFound = await db
          .select({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          })
          .from(user)
          .where(inArray(user.id, validWorkspaceMembersIds));
        const validUsers = validUsersFound.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }));

        return c.json({ data: validUsers }, 200);
      } catch (error) {
        console.error("Error while fetching project members", error);
        return c.json(
          {
            error: "FailedToFetchProjectMembers",
            message: "Failed to fetch project members",
          },
          500
        );
      }
    }
  )
  .post(
    "/add-project-member",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        projectId: z.string(),
        workspaceId: z.string(),
        addMembers: z
          .array(
            z.object({
              userId: z.string(),
              userRole: z.enum(["admin", "member", "viewer"]),
            })
          )
          .min(1, "At least one user must be invited"),
      })
    ),
    async (c) => {
      const { projectId, workspaceId, addMembers } = c.req.valid("json");
      const user = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!user) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }
      // Check if the current user is a workspace member
      const workspaceMemberFound = await db
        .select()
        .from(workspaceMember)
        .where(
          and(
            eq(workspaceMember.workspaceId, workspaceId),
            eq(workspaceMember.userId, user.id)
          )
        );
      if (workspaceMemberFound.length === 0) {
        return c.json(
          {
            error: "Unauthorized",
            message: "Unauthorized, you aren't a workspace member",
          },
          401
        );
      }
      // Check if the current user is a project admin or in the project
      const projectMemberFound = await db
        .select()
        .from(projectMember)
        .where(
          and(
            eq(projectMember.projectId, projectId),
            eq(projectMember.userId, user.id),
            eq(projectMember.role, "admin")
          )
        );
      if (projectMemberFound.length === 0) {
        return c.json(
          {
            error: "Unauthorized",
            message: "Unauthorized, you aren't a project admin",
          },
          401
        );
      }
      // Extract user IDs for validations
      const addUserIds = addMembers.map((user) => user.userId);
      // Verify all invited users are workspace members
      const workspaceMembers = await db
        .select({ userId: workspaceMember.userId })
        .from(workspaceMember)
        .where(
          and(
            eq(workspaceMember.workspaceId, workspaceId),
            inArray(workspaceMember.userId, addUserIds)
          )
        );
      const validWorkspaceMemberIds = workspaceMembers.map((m) => m.userId);
      if (validWorkspaceMemberIds.length !== addUserIds.length) {
        return c.json({
          error: "BadRequest",
          message: "Some invited users are not workspace members",
        });
      }
      // Check if any invited users are already project members
      const existingProjectMembers = await db
        .select({ userId: projectMember.userId })
        .from(projectMember)
        .where(
          and(
            eq(projectMember.projectId, projectId),
            inArray(projectMember.userId, addUserIds)
          )
        );
      const existingUserIds = existingProjectMembers.map((m) => m.userId);
      const validAddUserIds = addUserIds.filter(
        (id) => !existingUserIds.includes(id)
      );
      if (validAddUserIds.length === 0) {
        return c.json(
          {
            error: "BadRequest",
            message: "All invited users are already project members",
          },
          400
        );
      }
      const newProjectMembers = addMembers.map((user) => ({
        projectId,
        userId: user.userId,
        role: user.userRole,
        id: crypto.randomUUID(),
      }));
      const insertMembers = await db
        .insert(projectMember)
        .values(newProjectMembers);
      return c.json({ data: insertMembers }, 200);
    }
  )
  .get(
    "/get-project-member/:projectId/:workspaceId",
    sessionMiddleware,
    async (c) => {
      const userFound = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!userFound) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }
      const projectId = c.req.param("projectId");
      const workspaceId = c.req.param("workspaceId");
      try {
        const projectMembersFound = await db
          .select()
          .from(projectMember)
          .where(
            and(
              eq(projectMember.projectId, projectId),
              eq(projectMember.userId, userFound.id)
            )
          );
        const workspaceMembersFound = await db
          .select()
          .from(workspaceMember)
          .where(
            and(
              eq(workspaceMember.workspaceId, workspaceId),
              eq(workspaceMember.userId, userFound.id),
              eq(workspaceMember.role, "admin")
            )
          );
        if (
          projectMembersFound.length === 0 &&
          workspaceMembersFound.length === 0
        ) {
          return c.json(
            {
              error: "Unauthorized",
              message: "Unauthorized, you can't access this project",
            },
            401
          );
        }

        const projectMembers = await db
          .select()
          .from(projectMember)
          .where(eq(projectMember.projectId, projectId));
        const projectMembersUserIds = projectMembers.map(
          (member) => member.userId
        );
        const userFetched = await db
          .select({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          })
          .from(user)
          .where(inArray(user.id, projectMembersUserIds));
        if (userFetched.length === 0) {
          return c.json(
            {
              error: "BadRequest",
              message: "No project members found",
            },
            400
          );
        }
        const userWithProjectRole = userFetched.map((user) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            userRole: projectMembers.find(
              (projectMember) => projectMember.userId === user.id
            )?.role,
          };
        });
        return c.json({ data: userWithProjectRole }, 200);
      } catch (error) {
        console.error("Error while fetching project members", error);
        return c.json(
          {
            error: "FailedToFetchProjectMembers",
            message: "Failed to fetch project members",
          },
          500
        );
      }
    }
  );

export default app;
