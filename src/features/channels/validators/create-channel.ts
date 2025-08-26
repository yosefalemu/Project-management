import z from "zod";

export const createChannelSchema = z.object({
  name: z
    .string()
    .nonempty("Channel name is required")
    .min(2, "Channel name must be at least 2 characters long"),
  description: z
    .string()
    .nonempty("Description is required")
    .max(500, "Description must be at most 500 characters long"),
  defaultReceiver: z.string(),
});

export type createChannelSchemaType = z.infer<typeof createChannelSchema>;
