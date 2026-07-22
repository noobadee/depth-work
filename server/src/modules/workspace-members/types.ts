import type { NewWorkspaceMember, WorkspaceMember } from "@/db/schema/index.ts";

export interface IWorkspaceMemberRepository {
  findAllByWorkspace(workspaceId: string): Promise<WorkspaceMember[] | null>;
  findByOwner(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMember | null>;
  findById(id: string): Promise<WorkspaceMember | null>;
  create(data: NewWorkspaceMember): Promise<WorkspaceMember | null>;
  update(
    id: string,
    data: Pick<WorkspaceMember, "role">,
  ): Promise<WorkspaceMember | null>;
  delete(id: string): Promise<void>;
}

export interface IWorkspaceMemberService {
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]>;
  getWorkspaceMember(id: string, workspaceId: string): Promise<WorkspaceMember>;
  createWorkspaceMember(
    workspaceId: string,
    body: CreateWorkspaceMemberInput,
  ): Promise<WorkspaceMember>;
  updateWorkspaceMember(
    userId: string,
    workspaceId: string,
    body: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMember>;
  deleteWorkspaceMember(userId: string, workspaceId: string): Promise<void>;
}

export interface CreateWorkspaceMemberInput {
  role: "owner" | "admin" | "member" | "viewer";
  email: string;
}

export interface UpdateWorkspaceMemberInput {
  role: "owner" | "admin" | "member" | "viewer";
}
