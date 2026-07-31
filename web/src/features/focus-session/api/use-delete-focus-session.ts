import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFocusSession, focusSessionKeys } from "@/entities/focus-session";

export function useDeleteFocusSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFocusSession,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: focusSessionKeys.all }),
  });
}
