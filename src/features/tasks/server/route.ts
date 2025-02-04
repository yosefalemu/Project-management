import { db } from "@/db";
import { member } from "@/db/schema/member";
import { task } from "@/db/schema/task";
import { sessionMiddleware } from "@/lib/session-middleware";
import { insertTaskSchema } from "@/zod-schemas/task-schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, asc } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneedId: z.string().nullish(), // Note: Potential typo, should be 'assignedId'
        status: z
          .enum(["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"])
          .nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      try {
        const userId = c.get("userId") as string;
        const { workspaceId, assigneedId, projectId, status, search, dueDate } =
          c.req.valid("query");

        // Verify workspace membership
        const memberFound = await db
          .select()
          .from(member)
          .where(
            and(eq(member.userId, userId), eq(member.workspaceId, workspaceId))
          );

        if (memberFound.length === 0) {
          return c.json(
            {
              error: "Unauthorized",
              message: "You are not a member of this workspace",
            },
            401
          );
        }

        // Build query conditions
        const conditions = [eq(task.workspaceId, workspaceId)];

        if (projectId) {
          conditions.push(eq(task.projectId, projectId));
        }

        if (assigneedId) {
          conditions.push(eq(task.assignedId, assigneedId));
        }

        if (status) {
          conditions.push(eq(task.status, status));
        }

        // if (search) {
        //   conditions.push(
        //     or(
        //       ilike(task.name, `%${search as string}%`),
        //       ilike(task.description, `%${search}%`)
        //     )
        //   );
        // }
        console.log("search", search);

        if (dueDate) {
          conditions.push(eq(task.dueDate, new Date(dueDate)));
        }

        // Execute query
        const tasks = await db
          .select()
          .from(task)
          .where(and(...conditions))
          .orderBy(asc(task.position));

        return c.json({ data: tasks }, 200);
      } catch (error) {
        console.log(error);
        return c.json(
          { error: "Internal Server Error", message: "Failed to get tasks" },
          500
        );
      }
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", insertTaskSchema),
    async (c) => {
      const userId = c.get("userId") as string;
      const {
        workspaceId,
        projectId,
        assignedId,
        description,
        name,
        dueDate,
        status,
        position,
      } = c.req.valid("json");
      try {
        const foundMember = await db
          .select()
          .from(member)
          .where(
            and(eq(member.userId, userId), eq(member.workspaceId, workspaceId))
          );
        if (foundMember.length === 0) {
          return c.json(
            {
              error: "Unauthorized",
              message: "You are not a member of this workspace",
            },
            401
          );
        }
        const [newTask] = await db
          .insert(task)
          .values({
            name,
            description,
            workspaceId,
            projectId,
            assignedId,
            dueDate,
            status: status || "BACKLOG",
            position,
          })
          .returning();
        return c.json({ data: newTask }, 200);
      } catch (error) {
        console.log(error);
        return c.json(
          { error: "Internal Server Error", message: "Failed to create task" },
          500
        );
      }
    }
  );

export default app;
