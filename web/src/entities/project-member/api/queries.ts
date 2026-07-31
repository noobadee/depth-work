import { queryOptions } from "@tanstack/react-query";
import {
  fetchProjectMembers,
  projectMemberKeys,
} from "@/entities/project-member";

export function projectMembersQueryOptions(projectId: string) {
  return queryOptions({
    queryKey: projectMemberKeys.all,
    queryFn: () => fetchProjectMembers(projectId),
  });
}
