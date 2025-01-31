import { db } from "@/db";
import { member } from "@/db/schema/member";
import { users } from "@/db/schema/user";
import { sessionMiddleware } from "@/lib/session-middleware";
import { insertMemberSchema } from "@/zod-schemas/member-schema";
import { selectUserType } from "@/zod-schemas/users-schema";
import { zValidator } from "@hono/zod-validator";
import { eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("param", z.object({ workspaceId: z.string() })),
    async (c) => {
      const workspaceId = c.req.param("workspaceId");
      try {
        const members = await db
          .select()
          .from(member)
          .where(eq(member.workspaceId, workspaceId));
        if (members.length === 0) {
          return c.json(
            {
              error: "Not Found",
              message: "No members found in the workspace",
            },
            404
          );
        }
        let usersFound: selectUserType[];
        const userIds = members.map((member) => member.userId);
        try {
          const currentMembers = await db
            .select({ id: users.id, name: users.name, email: users.email })
            .from(users)
            .where(inArray(users.id, userIds));
          usersFound = currentMembers;
          return c.json({ data: usersFound });
        } catch (error) {
          console.log("Error while finding the users", error);
          return c.json(
            {
              error: "Internal server error",
              message: "Error while finding the users",
            },
            500
          );
        }
      } catch (error) {
        console.log("Error while finding the workspace members", error);
        return c.json(
          {
            error: "Internal server error",
            message: "Error while finding the workspace members",
          },
          500
        );
      }
    }
  )
  .post("/", zValidator("json", insertMemberSchema), async (c) => {
    const { userId, workspaceId, role } = c.req.valid("json");
    console.log(userId, workspaceId, role);
    return c.json({ data: "Hello World" });
  });

export default app;
