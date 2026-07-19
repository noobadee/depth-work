import {
  ConflictError,
  DatabaseError,
  ForbiddenError,
  NotFoundError,
} from "@/common/errors/index.ts";
import type { WorkspaceMember } from "@/db/schema/index.ts";
import type {
  CreateWorkspaceMemberInput,
  IWorkspaceMemberRepository,
  IWorkspaceMemberService,
  UpdateWorkspaceMemberInput,
} from "@/modules/workspace-members/types.ts";

export class WorkspaceMemberService implements IWorkspaceMemberService {
  constructor(private readonly repo: IWorkspaceMemberRepository) {}

  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const workspaceMembers = await this.repo.findAllByWorkspaceId(workspaceId);

    if (!workspaceMembers || workspaceMembers.length === 0) {
      throw new NotFoundError("Workspace members");
    }

    return workspaceMembers;
  }

  async getWorkspaceMember(
    id: string,
    userId: string,
  ): Promise<WorkspaceMember> {
    const workspaceMember = await this.repo.findById(id);

    if (!workspaceMember) {
      throw new NotFoundError("Workspace member");
    }

    if (workspaceMember.userId !== userId) {
      throw new ForbiddenError("You are not a member of this workspace");
    }

    return workspaceMember;
  }

  async createWorkspaceMember(
    data: CreateWorkspaceMemberInput,
  ): Promise<WorkspaceMember> {
    const workspaceMembers = await this.getWorkspaceMembers(data.workspaceId);

    const existing = workspaceMembers.filter(
      (member) =>
        member.workspaceId === data.workspaceId &&
        member.userId === data.userId,
    );

    if (existing) {
      throw new ConflictError("Workspace member already exists");
    }

    const newWorkspaceMember = await this.repo.create(data);

    if (!newWorkspaceMember) {
      throw new DatabaseError(
        "Insert succeeded but no row was returned for workspace member creation",
      );
    }

    return newWorkspaceMember;
  }

  async updateWorkspaceMember(
    id: string,
    userId: string,
    data: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMember> {
    await this.getWorkspaceMember(id, userId); // verify existence and ownership

    const updatedWorkspaceMember = await this.repo.update(id, data);

    if (!updatedWorkspaceMember) {
      throw new DatabaseError(
        "Update succeeded but no row was returned for workspace member update",
      );
    }

    return updatedWorkspaceMember;
  }

  async deleteWorkspaceMember(id: string, userId: string): Promise<void> {
    await this.getWorkspaceMember(id, userId); // verify existence and ownership
    await this.repo.delete(id);
  }
}
