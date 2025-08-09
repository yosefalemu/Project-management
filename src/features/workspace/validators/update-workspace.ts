import z from "zod";

export const updateWorkspaceSchema = z.object({
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
});

export type updateWorkspaceSchemaType = z.infer<typeof updateWorkspaceSchema>;
