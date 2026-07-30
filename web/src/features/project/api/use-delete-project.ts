import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject, projectKeys } from "@/entities/project";

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
