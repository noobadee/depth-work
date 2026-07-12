export { makeWorkspace, makeWorkspaceMembers };

import { randomUUID } from "node:crypto";
import type { NewWorkspace, NewWorkspaceMember } from "@db/schema/index.ts";

interface MakeWorkspace {
  ownerId: string;
  name: string;
  type: "personal" | "team";
}

interface MakeWorkspaceMember {
  workspaceId: string;
  userId: string;
  role: "owner" | "admin" | "member" | "viewer";
}

function makeWorkspace({ ownerId, name, type }: MakeWorkspace): NewWorkspace {
  return {
    workspace_id: randomUUID(),
    name,
    type,
    ownerId,
  };
}

function makeWorkspaceMembers(
  members: MakeWorkspaceMember[],
): NewWorkspaceMember[] {
  const newMembers = members.map((member) => ({
    id: randomUUID(),
    workspaceId: member.workspaceId,
    userId: member.userId,
    role: member.role,
  }));

  return newMembers;
}
