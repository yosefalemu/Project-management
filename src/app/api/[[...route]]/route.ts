import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import auth from "@/features/auth/server/route";
import workspace from "@/features/workspace/server/route";
import member from "@/features/members/server/route";
import project from "@/features/projects/server/route";
import task from "@/features/tasks/server/route";

const app = new Hono().basePath("/api").use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://project-management-beryl-five.vercel.app",
    ],
  })
);
app.use();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", auth)
  .route("/workspace", workspace)
  .route("/members", member)
  .route("/projects", project)
  .route("/tasks", task);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
