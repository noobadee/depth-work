import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFocusSession, focusSessionKeys } from "@/entities/focus-session";

export function useCreateFocusSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFocusSession,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: focusSessionKeys.all }),
  });
}
