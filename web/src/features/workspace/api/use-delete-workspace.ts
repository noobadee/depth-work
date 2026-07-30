import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkspace, workspaceKeys } from "@/entities/workspace";

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all }),
  });
}
