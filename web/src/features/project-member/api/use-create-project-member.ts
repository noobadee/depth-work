import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProjectMember,
  projectMemberKeys,
} from "@/entities/project-member";

export function useCreateProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProjectMember,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectMemberKeys.all }),
  });
}
