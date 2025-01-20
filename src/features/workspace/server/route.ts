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
  .get("/current", async (c) => {
    return c.json({ data: "Current workspace" });
  })
  .post(
    "/",
    zValidator("json", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const { name } = c.req.valid("json");
      const token = getCookie(c, "JIRA_CLONE_AUTH_COOKIE");

      let userId: string;

      try {
        userId = await verifyToken(token!, process.env.JWT_SECRET!);
      } catch (error) {
        console.log("Error while verifying token", error);
        return c.json(
          { error: "Unauthorized", message: "Invalid or expired token" },
          401
        );
      }

      try {
        const [newWorkspace] = await db
          .insert(workSpaces)
          .values({ name, userId })
          .returning();

        return c.json({ data: newWorkspace });
      } catch (err) {
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
