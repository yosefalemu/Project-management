import { db } from "../../..";
import { channel, channelMember } from "@/db/schema";
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

        const newChannel = await db.transaction(async (tx) => {
          const exstingChannel = await tx
            .select()
            .from(channel)
            .where(
              and(eq(channel.name, name), eq(channel.projectId, projectId))
            );
          if (exstingChannel.length > 0) {
            return c.json(
              {
                error: "Channel already exists",
                message:
                  "Channel with this name already exists in this project",
              },
              409
            );
          }
          const newChannel = await tx
            .insert(channel)
            .values({
              id: crypto.randomUUID(),
              name,
              description,
              projectId,
              creatorId: userFound.id,
            })
            .returning();
          await tx
            .insert(channelMember)
            .values({
              id: crypto.randomUUID(),
              userId: "12345",
              channelId: newChannel[0].id,
            })
            .returning();

          return c.json(
            {
              message: "Channel created successfully",
            },
            200
          );
        });
        return newChannel;
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
