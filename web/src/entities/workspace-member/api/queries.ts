export { workspaceMembersQueryOptions, workspaceMembersOwnedQueryOptions };

import { queryOptions } from "@tanstack/react-query";
import {
  fetchWorkspaceMembers,
  fetchWorkspaceMembersByOwner,
  workspaceMemberKeys,
} from "@/entities/workspace-member";

function workspaceMembersQueryOptions(workspaceId: string) {
  return queryOptions({
    queryKey: workspaceMemberKeys.all,
    queryFn: () => fetchWorkspaceMembers(workspaceId),
  });
}

function workspaceMembersOwnedQueryOptions(userId: string | undefined) {
  return queryOptions({
    queryKey: [...workspaceMemberKeys.all, "owned"],
    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return fetchWorkspaceMembersByOwner(userId);
    },
    enabled: !!userId,
  });
}
