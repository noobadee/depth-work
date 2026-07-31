import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteProjectMember,
  projectMemberKeys,
} from "@/entities/project-member";

export function useDeleteProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProjectMember,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectMemberKeys.all }),
  });
}
