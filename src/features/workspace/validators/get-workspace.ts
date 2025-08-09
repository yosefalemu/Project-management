import z from "zod";

export const getWorkspaceSchema = z.object({
  id: z.string().nonempty("Workspace ID is required"),
  name: z
    .string()
    .nonempty("Workspace name is required")
    .min(3, "Workspace name must be at least 3 characters long")
    .max(50, "Workspace name must be at most 50 characters long"),
  description: z
    .string()
    .nonempty("Workspace description is required")
    .min(50, "Workspace description must be at least 50 characters long")
    .max(500, "Workspace description must be at most 500 characters long"),
  image: z.string().optional(),
  creatorId: z.string().nonempty("Creator ID is required"),
  inviteCode: z.string().nonempty("Invite code is required"),
  createdAt: z.date({
    required_error: "Created at date is required",
    invalid_type_error: "Created at must be a valid date",
  }),
  updatedAt: z.date({
    required_error: "Updated at date is required",
    invalid_type_error: "Updated at must be a valid date",
  }),
});

export type getWorkspaceSchemaType = z.infer<typeof getWorkspaceSchema>;
