/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { auth } from "@/lib/auth";
import customAuth from "@/features/auth/server/route";
import workspace from "@/features/workspace/server/route";
import member from "@/features/members/server/route";
import project from "@/features/projects/server/route";
import task from "@/features/tasks/server/route";
import channel from "@/features/channels/server/route";

const app = new Hono().basePath("/api").use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://project-management-sandy-one.vercel.app",
    ],
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS", "PATCH", "DELETE"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600, // 10 minutes
    credentials: true,
  })
);
// Handle authentication routes using better-auth
app.on(["POST", "GET"], "/auth/*", (c) => {
  console.log("Handling auth request using better-auth");
  return auth.handler(c.req.raw);
});

const routes = app
  .route("/custom-auth", customAuth)
  .route("/workspace", workspace)
  .route("/members", member)
  .route("/projects", project)
  .route("/tasks", task)
  .route("/channels", channel);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
