import z from "zod";

export const createWorkspaceSchema = z.object({
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

export type createWorkspaceSchemaType = z.infer<typeof createWorkspaceSchema>;
