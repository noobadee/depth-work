import type { NewWorkspaceMember, WorkspaceMember } from "@/db/schema/index.ts";

export interface IWorkspaceMemberRepository {
  findAllByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[] | null>;
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
  getWorkspaceMember(id: string, userId: string): Promise<WorkspaceMember>;
  createWorkspaceMember(
    data: CreateWorkspaceMemberInput,
  ): Promise<WorkspaceMember>;
  updateWorkspaceMember(
    id: string,
    userId: string,
    data: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMember>;
  deleteWorkspaceMember(id: string, userId: string): Promise<void>;
}

export interface CreateWorkspaceMemberInput {
  workspaceId: string;
  userId: string;
  role: "owner" | "admin" | "member" | "viewer";
}

export interface UpdateWorkspaceMemberInput {
  role: "owner" | "admin" | "member" | "viewer";
}
