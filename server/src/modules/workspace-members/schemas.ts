import { z } from "zod";

export const createWorkspaceMemberSchema = z.object({
  role: z.enum(["owner", "admin", "member", "viewer"]),
  workspaceId: z.uuid("Invalid workspace ID"),
  inviteeEmail: z.email(),
});

export const updateWorkspaceMemberSchema = z.object({
  workspaceId: z.uuid("Invalid workspace ID"),
  role: z.enum(["owner", "admin", "member", "viewer"]),
});

export const workspaceIdSchema = z.object({
  workspaceId: z.uuid("Invalid workspace ID"),
});

export const workspaceMemberIdSchema = z.object({
  id: z.uuid("Invalid workspace member ID"),
});

export type CreateWorkspaceMemberBody = z.infer<
  typeof createWorkspaceMemberSchema
>;

export type UpdateWorkspaceMemberBody = z.infer<
  typeof updateWorkspaceMemberSchema
>;

export type WorkspaceIdBody = z.infer<typeof workspaceIdSchema>;

export type WorkspaceMemberIdParams = z.infer<typeof workspaceMemberIdSchema>;
