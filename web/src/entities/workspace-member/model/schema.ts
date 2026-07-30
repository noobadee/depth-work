import { z } from "zod";

export const workspaceMemberSchema = z.object({
  id: z.uuid("Invalid workspace member ID"),
  workspaceId: z.uuid("Invalid workspace ID"),
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["owner", "admin", "member", "viewer"]),
  joined_at: z.iso.datetime(),
});

export const workspaceMemberResponseSchema = z.object({
  status: z.string().min(1, "Response status is required"),
  message: z.string().min(1, "Response message is required"),
  data: z.array(workspaceMemberSchema),
});

export type WorkspaceMember = z.infer<typeof workspaceMemberResponseSchema>;
