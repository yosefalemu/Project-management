import z from "zod";

export const getChannelSchema = z.object({
  id: z.string().nonempty("Channel ID is required"),
  name: z.string().nonempty("Channel name is required"),
  description: z.string().nonempty("Description is required"),
  projectId: z.string().nonempty("Project ID is required"),
  createdAt: z.string().nonempty("Creation date is required"),
  updatedAt: z.string().nonempty("Update date is required"),
});

export type getChannelSchemaType = z.infer<typeof getChannelSchema>;
