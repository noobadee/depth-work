import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFocusSession, focusSessionKeys } from "@/entities/focus-session";

export function useUpdateFocusSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFocusSession,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: focusSessionKeys.all }),
  });
}
