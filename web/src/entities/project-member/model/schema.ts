import { z } from "zod";

export const projectMemberSchema = z.object({
  id: z.uuid("Invalid project member ID"),
  projectId: z.uuid("Invalid project ID"),
  userId: z.string().min(1, "User ID is required"),
  added_at: z.iso.datetime(),
});

export const projectMemberResponseSchema = z.object({
  status: z.string().min(1, "Response status is required"),
  message: z.string().min(1, "Response message is required"),
  data: z.array(projectMemberSchema),
});

export type ProjectMember = z.infer<typeof projectMemberResponseSchema>;
