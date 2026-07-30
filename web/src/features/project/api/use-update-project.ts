import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject, projectKeys } from "@/entities/project";

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProject,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
