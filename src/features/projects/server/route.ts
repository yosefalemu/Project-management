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
import { and, eq, inArray } from "drizzle-orm";
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
      console.log("workspaceMembersFound", workspaceMembersFound);
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
    "/invite-project-member/:projectId/:workspaceId",
    sessionMiddleware,
    zValidator(
      "param",
      z.object({ projectId: z.string(), workspaceId: z.string() })
    ),
    async (c) => {
      const { projectId, workspaceId } = c.req.valid("param");
      const userId = c.get("userId") as string;
      console.log("projectId", projectId);
      console.log("workspaceId", workspaceId);
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
                "Unauthorized, you should be a member of this workspace to invite project member",
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
              message: "Unauthorized, you can't invite project member",
            },
            401
          );
        }
        const allWorkspaceMembers = await db
          .select()
          .from(workspaceMember)
          .where(eq(workspaceMember.workspaceId, workspaceId));
        const canBeInviteMembers = allWorkspaceMembers.filter(
          (member) =>
            !projectMembersFound.some(
              (projectMember) => projectMember.userId === member.userId
            ) && member.userId !== userId
        );
        const canBeInviteMembersIds = canBeInviteMembers.map(
          (member) => member.userId
        );
        const usersFound = await db
          .select()
          .from(user)
          .where(inArray(user.id, canBeInviteMembersIds));
        const users = usersFound.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        }));
        return c.json({ data: users }, 200);
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
    "/invite-project-member",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        projectId: z.string(),
        workspaceId: z.string(),
        invitedUser: z
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
      const { projectId, workspaceId, invitedUser } = c.req.valid("json");
      const userId = c.get("userId") as string;
      console.log("Invited user ids", invitedUser);
      console.log("Project id found", projectId);
      console.log("Workspace id found", workspaceId);
      console.log("User id found", userId);
      // Check if the current user is a workspace member
      const workspaceMemberFound = await db
        .select()
        .from(workspaceMember)
        .where(and(eq(workspaceMember.workspaceId, workspaceMember.userId)));
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
      const invitedUserIds = invitedUser.map((user) => user.userId);
      // Verify all invited users are workspace members
      const workspaceMembers = await db
        .select({ userId: workspaceMember.userId })
        .from(workspaceMember)
        .where(
          and(
            eq(workspaceMember.workspaceId, workspaceId),
            inArray(workspaceMember.userId, invitedUserIds)
          )
        );
      const validWorkspaceMemberIds = workspaceMembers.map((m) => m.userId);
      if (validWorkspaceMemberIds.length !== invitedUserIds.length) {
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
            inArray(projectMember.userId, invitedUserIds)
          )
        );
      const existingUserIds = existingProjectMembers.map((m) => m.userId);
      const validInvitedUserIds = invitedUserIds.filter(
        (id) => !existingUserIds.includes(id)
      );
      if (validInvitedUserIds.length === 0) {
        return c.json(
          {
            error: "BadRequest",
            message: "All invited users are already project members",
          },
          400
        );
      }
      const newProjectMembers = invitedUser.map((user) => ({
        projectId,
        userId: user.userId,
        role: user.userRole,
      }));
      const insertMembers = await db
        .insert(projectMember)
        .values(newProjectMembers);
      return c.json({ data: insertMembers }, 200);
    }
  );

export default app;
