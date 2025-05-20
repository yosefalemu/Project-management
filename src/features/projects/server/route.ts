import { db } from "@/db";
import {
  project,
  projectMember,
  user,
  workspaceMember,
} from "@/db/schema/schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createProjectSchema } from "@/zod-schemas/project-schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray, notInArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("param", z.object({ workspaceId: z.string() })),
    async (c) => {
      try {
        const workspaceId = c.req.param("workspaceId");
        const userId = c.get("userId") as string;
        const workspaceMembersFound = await db
          .select()
          .from(workspaceMember)
          .where(
            and(
              eq(workspaceMember.workspaceId, workspaceId),
              eq(workspaceMember.userId, userId)
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
          .where(eq(projectMember.userId, userId));
        const projectMemberIds = projectMemberFound.map(
          (projectMember) => projectMember.projectId
        );
        const projectFound = await db
          .select()
          .from(project)
          .where(
            and(
              eq(project.workspaceId, workspaceId),
              inArray(project.id, projectMemberIds)
            )
          );
        return c.json({ data: projectFound }, 200);
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
    }
  )
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
    zValidator("form", createProjectSchema),
    async (c) => {
      const { name, description, workspaceId, image } = c.req.valid("form");
      const userId = c.get("userId") as string;
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
      const workspaceMembersFound = await db
        .select()
        .from(workspaceMember)
        .where(
          and(
            eq(workspaceMember.workspaceId, workspaceId),
            eq(workspaceMember.role, "admin")
          )
        );
      if (workspaceMembersFound.length === 0) {
        return c.json(
          {
            error: "Unauthorized",
            message: "Unauthorized, you can't create project in this workspace",
          },
          401
        );
      }
      try {
        const [newProject] = await db
          .insert(project)
          .values({
            name,
            description,
            workspaceId,
            image: uploadedImage,
            creatorId: userId,
            inviteCode: Math.random().toString(36).substring(2, 8),
          })
          .returning();
        if (!newProject) {
          return c.json(
            {
              error: "FailedToCreateProject",
              message: "Failed to create project",
            },
            400
          );
        }
        try {
          await db.insert(projectMember).values({
            projectId: newProject.id,
            role: "admin",
            userId: userId,
          });
        } catch (error) {
          console.error("Error while adding project member", error);
          await db.delete(project).where(eq(project.id, newProject.id));
          return c.json(
            {
              error: "FailedToAddProjectMember",
              message: "Failed to add project member",
            },
            500
          );
        }
        return c.json({ data: newProject }, 200);
      } catch (error) {
        console.log("Error while creating project", error);
        return c.json(
          {
            error: "FailedToCreateProject",
            message: "Failed to create project",
          },
          500
        );
      }
    }
  )
  .patch(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    (c) => {
      const { name, description, workspaceId, image } = c.req.valid("form");
      return c.json({ name, description, workspaceId, image }, 200);
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
      const userId = c.get("userId") as string;
      try {
        const workspaceMembersFound = await db
          .select()
          .from(workspaceMember)
          .where(
            and(
              eq(workspaceMember.workspaceId, workspaceId),
              eq(workspaceMember.userId, userId)
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
              eq(projectMember.userId, userId)
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

        //Get all project members for the project
        const projectMembers = await db
          .select({ userId: projectMember.userId })
          .from(projectMember)
          .where(eq(projectMember.projectId, projectId));

        const projectMembersIds = projectMembers.map((member) => member.userId);
        //Get workspace members which are not in the project members
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
          .select({ id: user.id, name: user.name, email: user.email })
          .from(user)
          .where(inArray(user.id, validWorkspaceMembersIds));
        const validUsers = validUsersFound.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
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
      const userId = c.get("userId") as string;
      // Check if the current user is a workspace member
      const workspaceMemberFound = await db
        .select()
        .from(workspaceMember)
        .where(
          and(
            eq(workspaceMember.workspaceId, workspaceId),
            eq(workspaceMember.userId, userId)
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
            eq(projectMember.userId, userId),
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
      // Extract user IDS for validations
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
      const userId = c.get("userId") as string;
      const projectId = c.req.param("projectId");
      const workspaceId = c.req.param("workspaceId");
      try {
        const projectMembersFound = await db
          .select()
          .from(projectMember)
          .where(
            and(
              eq(projectMember.projectId, projectId),
              eq(projectMember.userId, userId)
            )
          );
        const workspaceMembersFound = await db
          .select()
          .from(workspaceMember)
          .where(
            and(
              eq(workspaceMember.workspaceId, workspaceId),
              eq(workspaceMember.userId, userId),
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
        const userFound = await db
          .select({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          })
          .from(user)
          .where(inArray(user.id, projectMembersUserIds));
        if (userFound.length === 0) {
          return c.json(
            {
              error: "BadRequest",
              message: "No project members found",
            },
            400
          );
        }
        const userWithProjectRole = userFound.map((user) => {
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
