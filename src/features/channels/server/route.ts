import { db } from "@/db";
import { channel, channelMember } from "@/db/schema/schema";
import { auth } from "@/lib/auth";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { createProjectChannelSchema } from "../validators/create-channel";

const app = new Hono()
  .get("/:projectId", sessionMiddleware, async (c) => {
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
      const projectId = c.req.param("projectId");
      if (!projectId) {
        return c.json({ error: "Project ID is required" }, 400);
      }

      const projectChannels = await db
        .select()
        .from(channel)
        .where(eq(channel.projectId, projectId));

      const userChannelsForProject = await db
        .select()
        .from(channelMember)
        .where(
          and(
            eq(channelMember.userId, userFound.id),
            inArray(
              channelMember.channelId,
              projectChannels.map((c) => c.id)
            )
          )
        );
      if (!userChannelsForProject.length) {
        return c.json(
          {
            data: [],
            message: "You are not a member of any channels in this project",
          },
          200
        );
      }
      const userChannels = projectChannels.filter((channel) =>
        userChannelsForProject.some((member) => member.channelId === channel.id)
      );
      return c.json(
        {
          data: userChannels,
          message: "Channels fetched successfully",
        },
        200
      );
    } catch (error) {
      console.error("Error fetching channels:", error);
      return c.json(
        {
          error: "Internal Server Error",
          message: "Failed to fetch channels",
        },
        500
      );
    }
  })
  .post(
    "/create",
    sessionMiddleware,
    zValidator("json", createProjectChannelSchema),
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
        const { name, description, projectId } = c.req.valid("json");
        if (!name || !description || !projectId) {
          return c.json(
            { error: "Bad Request", message: "All fields are required" },
            400
          );
        }
        const newChannel = await db
          .insert(channel)
          .values({
            id: crypto.randomUUID(),
            name,
            description,
            projectId,
            creatorId: userFound.id,
          })
          .returning();
        try {
          await db.insert(channelMember).values({
            id: crypto.randomUUID(),
            userId: userFound.id,
            channelId: newChannel[0].id,
          });
        } catch (error) {
          await db.delete(channel).where(eq(channel.id, newChannel[0].id));
          console.error("Error creating channel:", error);
          return c.json(
            {
              error: "Internal Server Error",
              message: "Failed to create channel",
            },
            500
          );
        }
        return c.json(
          {
            data: newChannel[0],
            message: "Channel created successfully",
          },
          201
        );
      } catch (error) {
        console.error("Error creating channel:", error);
        return c.json(
          {
            error: "Internal Server Error",
            message: "Failed to create channel",
          },
          500
        );
      }
    }
  );

export default app;
