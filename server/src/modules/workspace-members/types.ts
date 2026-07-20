import type { NewWorkspaceMember, WorkspaceMember } from "@/db/schema/index.ts";

export interface IWorkspaceMemberRepository {
  findAllByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[] | null>;
  findByWorkspaceUserId(
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceMember | null>;
  findById(id: string): Promise<WorkspaceMember | null>;
  create(data: NewWorkspaceMember): Promise<WorkspaceMember | null>;
  update(
    id: string,
    data: Pick<WorkspaceMember, "workspaceId" | "role">,
  ): Promise<WorkspaceMember | null>;
  delete(id: string): Promise<void>;
}

export interface IWorkspaceMemberService {
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]>;
  getWorkspaceMember(id: string, workspaceId: string): Promise<WorkspaceMember>;
  createWorkspaceMember(
    creatorId: string,
    data: CreateWorkspaceMemberInput,
  ): Promise<WorkspaceMember>;
  updateWorkspaceMember(
    params: { id: string },
    userId: string,
    data: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMember>;
  deleteWorkspaceMember(
    params: { id: string },
    body: { workspaceId: string },
    userId: string,
  ): Promise<void>;
}

export interface CreateWorkspaceMemberInput {
  workspaceId: string;
  role: "owner" | "admin" | "member" | "viewer";
  inviteeEmail: string;
}

export interface UpdateWorkspaceMemberInput {
  workspaceId: string;
  role: "owner" | "admin" | "member" | "viewer";
}
