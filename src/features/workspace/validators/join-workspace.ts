import z from "zod";

export const joinWorkspaceSchema = z.object({
  inviteCode: z.string().nonempty("Invite code is required"),
  workspaceId: z.string().nonempty("Workspace ID is required"),
});

export type joinWorkspaceSchemaType = z.infer<typeof joinWorkspaceSchema>;
