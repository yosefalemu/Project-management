import z from "zod";

export const getChannelMessagesSchema = z.object({
  id: z.string().nonempty("Channel Message ID is required"),
  channelId: z.string().nonempty("Channel ID is required"),
  senderId: z.string().nonempty("Sender ID is required"),
  content: z.string().nonempty("Content is required"),
  createdAt: z.string().nonempty("Created At is required"),
  updatedAt: z.string().nonempty("Updated At is required"),
});

export type getChannelMessagesSchemaType = z.infer<
  typeof getChannelMessagesSchema
>;
