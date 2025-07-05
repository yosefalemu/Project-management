import { db } from "@/db";
import { sessionMiddleware } from "@/lib/session-middleware";
import { insertTaskSchema } from "@/zod-schemas/task-schema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, asc, desc, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { TaskStatus } from "../constant/types";
import { task, user, projectMember, workspaceMember } from "@/db/schema/schema";
import { auth } from "@/lib/auth";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneedTo: z.string().nullish(),
        status: z
          .enum(["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"])
          .nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      try {
        const userFound = c.get("user") as
          | typeof auth.$Infer.Session.user
          | null;
        if (!userFound) {
          return c.json(
            { error: "Unauthorized", message: "User not authenticated" },
            401
          );
        }
        const { workspaceId, assigneedTo, projectId, status, search, dueDate } =
          c.req.valid("query");
        // Check if the user is a member of the workspace
        const workspaceMemberFound = await db
          .select()
          .from(workspaceMember)
          .where(
            and(
              eq(workspaceMember.userId, userFound.id),
              eq(workspaceMember.workspaceId, workspaceId)
            )
          );

        if (workspaceMemberFound.length === 0) {
          return c.json(
            {
              error: "Unauthorized",
              message: "You are not a member of this workspace",
            },
            401
          );
        }

        // Check if the user is a member of the project
        const projectMemberFound = await db
          .select()
          .from(projectMember)
          .where(
            and(
              eq(projectMember.userId, userFound.id),
              eq(projectMember.projectId, projectId as string)
            )
          );

        if (projectMemberFound.length === 0) {
          return c.json(
            {
              error: "Unauthorized",
              message: "You are not a projectMember of this workspace",
            },
            401
          );
        }
        // Build query conditions
        const conditions = [eq(task.projectId, projectId as string)];

        if (projectId) {
          conditions.push(eq(task.projectId, projectId));
        }

        if (assigneedTo) {
          conditions.push(eq(task.assignedTo, assigneedTo));
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

        // Extract unique assigned user IDs
        const assignedUserIds = tasks
          .map((t) => t.assignedTo)
          .filter((id) => id !== null) as string[];

        // Fetch users for the assigned IDs
        const assignedUsers = assignedUserIds.length
          ? await db
              .select()
              .from(user)
              .where(inArray(user.id, assignedUserIds))
          : [];

        // Create a lookup object for quick access
        const userMap = Object.fromEntries(assignedUsers.map((u) => [u.id, u]));

        // Map assigned users to their respective tasks
        const tasksWithAssignedUsers = tasks.map((t) => ({
          ...t,
          assignedUser: t.assignedTo ? userMap[t.assignedTo] || null : null,
        }));
        return c.json({ data: tasksWithAssignedUsers }, 200);
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
      const user = c.get("user") as typeof auth.$Infer.Session.user | null;
      if (!user) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }
      const { projectId, assignedTo, description, name, dueDate, status } =
        c.req.valid("json");

      try {
        // Check if the user is a projectMember of the workspace
        const foundprojectMember = await db
          .select()
          .from(projectMember)
          .where(
            and(
              eq(projectMember.userId, user.id),
              eq(projectMember.projectId, projectId)
            )
          );

        if (foundprojectMember.length === 0) {
          return c.json(
            {
              error: "Unauthorized",
              message: "You are not a projectMember of this workspace",
            },
            401
          );
        }

        // Get the maximum position for the given status in the workspace
        const lastTask = await db
          .select({ maxPosition: task.position })
          .from(task)
          .where(
            and(
              eq(task.projectId, projectId),
              eq(task.projectId, projectId),
              eq(
                task.status,
                status as
                  | "BACKLOG"
                  | "TODO"
                  | "IN_PROGRESS"
                  | "IN_REVIEW"
                  | "DONE"
              )
            )
          )
          .orderBy(desc(task.position))
          .limit(1);

        const newPosition =
          lastTask.length > 0 ? Number(lastTask[0].maxPosition) + 1 : 0;

        // Insert the new task with the calculated position
        const [newTask] = await db
          .insert(task)
          .values({
            name,
            description,
            projectId,
            assignedTo,
            dueDate,
            status: status || "BACKLOG",
            position: newPosition,
            id: crypto.randomUUID(),
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
  )
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const taskId = c.req.param("taskId") as string;
    try {
      await db.delete(task).where(eq(task.id, taskId));
      return c.json({ message: "Task deleted successfully" }, 200);
    } catch (error) {
      console.log("ERROR OCCURED WHILE DELETING TASK", error);
      return c.json(
        {
          error: "FailedToDeleteTask",
          message: "Failed to delete task",
        },
        500
      );
    }
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().min(0),
          })
        ),
      })
    ),
    async (c) => {
      try {
        const { tasks } = c.req.valid("json");
        const user = c.get("user") as typeof auth.$Infer.Session.user | null;
        if (!user) {
          return c.json(
            { error: "Unauthorized", message: "User not authenticated" },
            401
          );
        }
        const tasksToUpdate = await db
          .select()
          .from(task)
          .where(
            inArray(
              task.id,
              tasks.map((t) => t.id)
            )
          );
        const workspaceIds = new Set(tasksToUpdate.map((t) => t.projectId));
        if (workspaceIds.size !== 1) {
          return c.json(
            {
              error: "InvalidRequest",
              message: "Tasks must belong to the same workspace",
            },
            400
          );
        }
        const workspaceId = workspaceIds.values().next().value as string;
        const projectMemberFound = await db
          .select()
          .from(projectMember)
          .where(
            and(
              eq(projectMember.userId, user.id),
              eq(projectMember.projectId, workspaceId)
            )
          );
        if (projectMemberFound.length === 0) {
          return c.json(
            {
              error: "Unauthorized",
              message: "You are not a projectMember of this workspace",
            },
            401
          );
        }
        const updatedTasks = await Promise.all(
          tasks.map(async (t) => {
            const { id, position, status } = t;
            await db
              .update(task)
              .set({
                position: position,
                status,
              })
              .where(eq(task.id, id));
          })
        );
        return c.json({ data: updatedTasks }, 200);
      } catch (error) {
        console.log("ERROR WHILE UPDATING BULK TASK", error);
        return c.json(
          {
            error: "Internal Server Error",
            message: "Failed to update tasks",
          },
          500
        );
      }
    }
  );

export default app;
