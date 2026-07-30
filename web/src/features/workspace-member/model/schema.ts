import { z } from "zod";

export const createWorkspaceMemberFormSchema = z.object({
  role: z.enum(["owner", "admin", "member", "viewer"]),
  email: z.email(),
});

export const updateWorkspaceMemberFormSchema = z.object({
  role: z.enum(["owner", "admin", "member", "viewer"]),
});

export type CreateWorkspaceMemberFormValues = z.infer<
  typeof createWorkspaceMemberFormSchema
>;

export type UpdateWorkspaceMemberFormValues = z.infer<
  typeof updateWorkspaceMemberFormSchema
>;
