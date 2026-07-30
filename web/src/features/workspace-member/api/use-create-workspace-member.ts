import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createWorkspaceMember,
  workspaceMemberKeys,
} from "@/entities/workspace-member";

export function useCreateWorkspaceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspaceMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceMemberKeys.all });
    },
  });
}
