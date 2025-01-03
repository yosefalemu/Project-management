import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, signupSchema } from "@/validators/auth";

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    return c.json({ email, password });
  })
  .post("/register", zValidator("json", signupSchema), async (c) => {
    const { name, email, confirm_password, password } = c.req.valid("json");
    return c.json({ name, email, confirm_password, password });
  });
export default app;
