import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/features/auth/server/route";
import workspace from "@/features/workspace/server/route";
import member from "@/features/members/server/route";
import project from "@/features/projects/server/route";

const app = new Hono().basePath("/api");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", auth)
  .route("/workspace", workspace)
  .route("/members", member)
  .route("/projects", project);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
