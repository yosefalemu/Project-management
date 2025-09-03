import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createChannelMessagesSchema } from "../validators/create-channel-messages";
import { auth } from "@/lib/auth";
import { db } from "@/index";
import { channelMember, channelMessages } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const app = new Hono()
  .get("/:channelId", sessionMiddleware, async (c) => {
    try {
      const userFound = c.get("user") as typeof auth.$Infer.Session.user | null;
      const session = c.get("session") as
        | typeof auth.$Infer.Session.session
        | null;
      if (!userFound || !session) {
        return c.json(
          { error: "Unauthorized", message: "User not authenticated" },
          401
        );
      }
      const channelId = c.req.param("channelId");
      if (!channelId) {
        return c.json(
          {
            error: "Bad Request",
            message: "Channel ID is required",
          },
          400
        );
      }
      const [memberCheck] = await db
        .select()
        .from(channelMember)
        .where(
          and(
            eq(channelMember.channelId, channelId),
            eq(channelMember.userId, userFound.id)
          )
        );
      if (!memberCheck) {
        return c.json(
          {
            error: "Forbidden",
            message: "User is not a member of the channel",
          },
          403
        );
      }
      const channelMessagesFound = await db
        .select()
        .from(channelMessages)
        .where(eq(channelMessages.channelId, channelId));
      return c.json(
        {
          data: channelMessagesFound,
          message: "Channel messages fetched successfully",
        },
        200
      );
    } catch (error) {
      console.error("Error fetching channel messages:", error);
      return c.json(
        {
          error: "Internal Server Error",
          message: "Failed to fetch channel messages",
        },
        500
      );
    }
  })
  .post(
    "/create",
    sessionMiddleware,
    zValidator("json", createChannelMessagesSchema),
    async (c) => {
      try {
        const userFound = c.get("user") as
          | typeof auth.$Infer.Session.user
          | null;
        const session = c.get("session") as
          | typeof auth.$Infer.Session.session
          | null;
        if (!userFound || !session) {
          return c.json(
            { error: "Unauthorized", message: "User not authenticated" },
            401
          );
        }
        const { content, channelId } = c.req.valid("json");
        if (!content.trim() || !channelId.trim()) {
          return c.json(
            {
              error: "Bad Request",
              message: "Content and Channel ID are required",
            },
            400
          );
        }
        const [channelMemberFound] = await db
          .select()
          .from(channelMember)
          .where(
            and(
              eq(channelMember.channelId, channelId),
              eq(channelMember.userId, userFound.id)
            )
          );
        if (!channelMemberFound) {
          return c.json(
            {
              error: "Forbidden",
              message: "User is not a member of the channel",
            },
            403
          );
        }
        const [message] = await db
          .insert(channelMessages)
          .values({
            id: crypto.randomUUID(),
            channelId,
            content,
            senderId: userFound.id,
          })
          .returning();
        return c.json(
          {
            data: message,
            message: "Message created successfully",
          },
          201
        );
      } catch (error) {
        console.error("Error creating channel message:", error);
        return c.json(
          {
            error: "Internal Server Error",
            message: "Failed to create message",
          },
          500
        );
      }
    }
  );

export default app;
