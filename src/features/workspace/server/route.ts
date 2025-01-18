import { db } from "@/db";
import { workSpaces } from "@/db/schema/workspace";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createWorkspaceSchema } from "@/zod-schemas/workspace-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const app = new Hono()
  .get("/current", async (c) => {
    return c.json({ data: "Current workspace" });
  })
  .post(
    "/",
    zValidator("json", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const { name, userId } = c.req.valid("json");
      try {
        const [createWorkspace] = await db
          .insert(workSpaces)
          .values({ name, userId })
          .returning();
        return c.json({ data: createWorkspace });
      } catch (error) {
        console.log("Error while creating workspace", error);
      }
    }
  );

export default app;
