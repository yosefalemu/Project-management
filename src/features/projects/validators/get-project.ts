import z from "zod";

export const getProjectSchema = z.object({
  name: z
    .string()
    .nonempty("Project name is required")
    .min(3, "Project name must be at least 3 characters long")
    .max(50, "Project name must be at most 50 characters long"),
  description: z
    .string()
    .nonempty("Project description is required")
    .min(50, "Project description must be at least 50 characters long")
    .max(500, "Project description must be at most 500 characters long"),
  image: z.string().optional(),
  isPrivate: z.boolean().default(false),
});
