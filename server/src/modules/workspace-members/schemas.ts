import { z } from "zod";

export const createWorkspaceMemberSchema = z.object({
  role: z.enum(["owner", "admin", "member", "viewer"]),
});

export const updateWorkspaceMemberSchema = z.object({
  role: z.enum(["owner", "admin", "member", "viewer"]),
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

export type WorkspaceMemberIdParams = z.infer<typeof workspaceMemberIdSchema>;
