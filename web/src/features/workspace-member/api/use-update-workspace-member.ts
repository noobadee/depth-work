import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateWorkspaceMember,
  workspaceMemberKeys,
} from "@/entities/workspace-member";

export function useUpdateWorkspaceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkspaceMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceMemberKeys.all });
    },
  });
}
