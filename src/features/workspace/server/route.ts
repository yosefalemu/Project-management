import { db } from "@/db";
import { workSpaces } from "@/db/schema/workspace";
import { sessionMiddleware } from "@/lib/session-middleware";
import { verifyToken } from "@/lib/verify-token";
import { createWorkspaceSchema } from "@/zod-schemas/workspace-schema";
import { zValidator } from "@hono/zod-validator";
import { NeonDbError } from "@neondatabase/serverless";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";

const app = new Hono()
  .get("/", async (c) => {
    const workspaces = await db.select().from(workSpaces);
    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const { name, image } = c.req.valid("form");

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
        return c.json(
          {
            error: "InvalidImage",
            message: "Invalid image",
          },
          400
        );
      }

      const token = getCookie(c, "JIRA_CLONE_AUTH_COOKIE");

      if (!token) {
        return c.json(
          { error: "Unauthorized", message: "No token provided" },
          401
        );
      }

      let userId: string;

      try {
        userId = await verifyToken(token, process.env.JWT_SECRET!);
      } catch (error) {
        console.error("Error while verifying token", error);
        return c.json(
          { error: "Unauthorized", message: "Invalid or expired token" },
          401
        );
      }
      try {
        const [newWorkspace] = await db
          .insert(workSpaces)
          .values({ name, userId, image: uploadedImage })
          .returning();

        return c.json({ data: newWorkspace });
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
  );

export default app;
