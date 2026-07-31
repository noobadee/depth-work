import { z } from "zod";

export const createProjectMemberFormSchema = z.object({
  email: z.email(),
});

export type CreateProjectMemberFormValues = z.infer<
  typeof createProjectMemberFormSchema
>;
