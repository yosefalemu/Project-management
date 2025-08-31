import { z } from "zod";
import { TaskStatus } from "@/features/tasks/constant/types";

export const updateTaskSchema = z.object({
  id: z.string().nonempty("Task ID is required"),
  name: z.string().max(50, "Task name must be at most 50 characters long"),
  description: z
    .string()
    .nonempty("Task description is required")
    .max(1000, "Task description must be at most 1000 characters long"),
  assignedTo: z.string().nonempty("Assigned member is required"),
  projectId: z.string().nonempty("Project ID is required"),
  status: z.enum([
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
  ]),
  dueDate: z
    .string()
    .nonempty("Due date is required")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Due date must be a valid date",
    })
    .refine((date) => new Date(date) > new Date(), {
      message: "Due date must be in the future",
    }),
});
export type updateTaskSchemaType = z.infer<typeof updateTaskSchema>;
