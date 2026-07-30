import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace, workspaceKeys } from "@/entities/workspace";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}
