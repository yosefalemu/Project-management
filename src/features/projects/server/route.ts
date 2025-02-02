import { db } from "@/db";
import { project } from "@/db/schema/project";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createProjectSchema } from "@/zod-schemas/project-schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("param", z.object({ workspaceId: z.string() })),
    async (c) => {
      const workspaceId = c.req.param("workspaceId");
      console.log(workspaceId);
      const projectsFind = await db
        .select()
        .from(project)
        .where(eq(project.workspaceId, workspaceId));
      return c.json({ data: projectsFind });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const { name, description, workspaceId, image } = c.req.valid("form");
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
  );

export default app;
