import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteFocusSessionTask,
  focusSessionTaskKeys,
} from "@/entities/focus-session-task";

export function useDeleteFocusSessionTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFocusSessionTask,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: focusSessionTaskKeys.all }),
  });
}
