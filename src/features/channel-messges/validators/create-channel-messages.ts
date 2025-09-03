import { z } from "zod";

export const createChannelMessagesSchema = z.object({
  channelId: z.string().nonempty("Channel ID is required"),
  content: z.string().nonempty("Content is required"),
});

export type createChannelMessagesSchemaType = z.infer<
  typeof createChannelMessagesSchema
>;
