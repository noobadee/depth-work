import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkspace, workspaceKeys } from "@/entities/workspace";

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkspace,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all }),
  });
}
