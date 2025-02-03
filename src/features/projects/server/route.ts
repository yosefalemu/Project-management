import { db } from "@/db";
import { member } from "@/db/schema/member";
import { project } from "@/db/schema/project";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createProjectSchema } from "@/zod-schemas/project-schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("param", z.object({ workspaceId: z.string() })),
    async (c) => {
      const workspaceId = c.req.param("workspaceId");
      try {
        const projectsFind = await db
          .select()
          .from(project)
          .where(eq(project.workspaceId, workspaceId));
        return c.json({ data: projectsFind });
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
        };
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
      const membersFound = await db
        .select()
        .from(member)
        .where(
          and(eq(member.workspaceId, workspaceId), eq(member.userId, userId))
        );
      if (membersFound.length === 0) {
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
          })
          .returning();
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
      return c.json({ name, description, workspaceId, image });
    }
  );

export default app;
