import { z } from "zod";

export const addMemberValidator = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
  addMembers: z
    .array(
      z.object({
        userId: z.string().min(1, "User ID is required"),
        userRole: z.enum(["admin", "member", "viewer"], {
          errorMap: () => ({ message: "User role is required" }),
        }),
      })
    )
    .min(1, "At least one member is required"),
});

export type addMemberType = z.infer<typeof addMemberValidator>;
