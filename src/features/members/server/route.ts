import { insertMemberSchema } from "@/zod-schemas/member-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const app = new Hono()
  .get("/", async (c) => {
    return c.json({ data: "Hello World" });
  })
  .post("/", zValidator("json", insertMemberSchema), async (c) => {
    const { userId, workspaceId, role } = c.req.valid("json");
    console.log(userId, workspaceId, role);
    return c.json({ data: "Hello World" });
  });

export default app;
