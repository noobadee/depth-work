import { queryOptions } from "@tanstack/react-query";
import {
  fetchWorkspaceMembers,
  workspaceMemberKeys,
} from "@/entities/workspace-member/index";

export function workspaceMembersQueryOptions(workspaceId: string) {
  return queryOptions({
    queryKey: workspaceMemberKeys.all,
    queryFn: () => fetchWorkspaceMembers(workspaceId),
  });
}
