import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteWorkspaceMember,
  workspaceMemberKeys,
} from "@/entities/workspace-member";

export function useDeleteWorkspaceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkspaceMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceMemberKeys.all });
    },
  });
}
