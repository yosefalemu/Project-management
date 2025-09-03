import {
  channel,
  channelDefaultReceiver,
  channelMember,
  projectMember,
  user,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { createChannelSchema } from "@/features/channels/validators/create-channel";
import { db } from "@/index";

const app = new Hono()
  .get("/all-channels", sessionMiddleware, async (c) => {
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
      const allChannels = await db.select().from(channel);
      return c.json(
        {
          data: allChannels,
          message: "Channels fetched successfully",
        },
        200
      );
    } catch (error) {
      console.error("Error fetching all channels:", error);
      return c.json(
        {
          error: "Internal Server Error",
          message: "Failed to fetch all channels",
        },
        500
      );
    }
  })
  .get("/project-channels/:projectId", sessionMiddleware, async (c) => {
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
  .get("/single-channel/:channelId", sessionMiddleware, async (c) => {
    try {
      const channelId = c.req.param("channelId");
      if (!channelId) {
        return c.json({ error: "Channel ID is required" }, 400);
      }
      console.log("channel id", channelId);
      const channelFound = await db
        .select()
        .from(channel)
        .where(eq(channel.id, channelId));

      if (!channelFound) {
        return c.json({ error: "Channel not found" }, 404);
      }

      const channelMembers = await db
        .select()
        .from(channelMember)
        .where(eq(channelMember.channelId, channelId));

      const memberIds = channelMembers.map((member) => member.userId);
      const members = await db
        .select()
        .from(user)
        .where(inArray(user.id, memberIds));

      return c.json(
        {
          data: {
            channel: channelFound[0],
            members: members || [],
          },
          message: "Channel fetched successfully",
        },
        200
      );
    } catch (error) {
      console.error("Error fetching channel:", error);
      return c.json(
        {
          error: "Internal Server Error",
          message: "Failed to fetch channel",
        },
        500
      );
    }
  })
  .post(
    "/create",
    sessionMiddleware,
    zValidator("json", createChannelSchema),
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
        if (!userFound.lastProjectId) {
          return c.json(
            {
              error: "Bad Request",
              message: "Project ID is required",
            },
            400
          );
        }
        const { name, description, defaultReceiver } = c.req.valid("json");
        if (!name || !description) {
          return c.json(
            { error: "Bad Request", message: "All fields are required" },
            400
          );
        }
        if (defaultReceiver) {
          const isRecieverProjectMember = await db
            .select()
            .from(projectMember)
            .where(
              and(
                eq(projectMember.projectId, userFound.lastProjectId),
                eq(projectMember.userId, defaultReceiver)
              )
            );
          if (!isRecieverProjectMember.length) {
            return c.json(
              {
                error: "Bad Request",
                message: "Default receiver must be a member of the project",
              },
              400
            );
          }
        }

        const existingChannel = await db
          .select()
          .from(channel)
          .where(
            and(
              eq(channel.name, name),
              eq(channel.projectId, userFound.lastProjectId)
            )
          );

        if (existingChannel.length > 0) {
          return c.json(
            {
              error: "Channel already exists",
              message: "Channel with this name already exists in this project",
            },
            409
          );
        }

        const newChannel = await db
          .insert(channel)
          .values({
            id: crypto.randomUUID(),
            name,
            description,
            projectId: userFound.lastProjectId,
            creatorId: userFound.id,
          })
          .returning();

        const newChannelMember = await db
          .insert(channelMember)
          .values({
            id: crypto.randomUUID(),
            userId: userFound.id,
            channelId: newChannel[0].id,
          })
          .returning();

        if (defaultReceiver) {
          await db.insert(channelDefaultReceiver).values({
            id: crypto.randomUUID(),
            userId: defaultReceiver,
            channelId: newChannel[0].id,
          });
        }

        if (!newChannelMember.length) {
          await db.delete(channel).where(eq(channel.id, newChannel[0].id));
          return c.json(
            {
              error: "Failed to add channel member",
              message: "Could not add creator as a member of the channel",
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
