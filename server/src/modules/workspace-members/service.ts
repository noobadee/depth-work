import { UserRepository } from "@/modules/auth/repository.ts";
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
    const workspaceMembers = await this.repo.findAllByWorkspace(workspaceId);

    if (!workspaceMembers || workspaceMembers.length === 0) {
      throw new NotFoundError("Workspace members");
    }

    return workspaceMembers;
  }

  async getWorkspaceMember(
    id: string,
    workspaceId: string,
  ): Promise<WorkspaceMember> {
    const workspaceMember = await this.repo.findById(id);

    if (!workspaceMember) {
      throw new NotFoundError("Workspace member");
    }

    if (workspaceMember.workspaceId !== workspaceId) {
      throw new ForbiddenError("You are not a member of this workspace");
    }

    return workspaceMember;
  }

  async createWorkspaceMember(
    workspaceId: string,
    body: CreateWorkspaceMemberInput,
  ): Promise<WorkspaceMember> {
    const userRepo = new UserRepository();

    const invitedUser = await userRepo.findByEmail(body.email);

    if (!invitedUser) {
      throw new NotFoundError("User");
    }

    const existingMember = await this.repo.findByOwner(
      invitedUser.id,
      workspaceId,
    );

    if (existingMember) {
      throw new ConflictError("User is already a workspace member");
    }

    const newWorkspaceMember = await this.repo.create({
      workspaceId,
      userId: invitedUser.id,
      role: body.role,
    });

    if (!newWorkspaceMember) {
      throw new DatabaseError(
        "Insert succeeded but no row was returned for workspace member creation",
      );
    }

    return newWorkspaceMember;
  }

  async updateWorkspaceMember(
    userId: string,
    workspaceId: string,
    body: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMember> {
    const workspaceMember = await this.repo.findByOwner(userId, workspaceId);

    if (!workspaceMember) {
      throw new NotFoundError("Workspace member");
    }

    const updatedWorkspaceMember = await this.repo.update(
      workspaceMember.id,
      body,
    );

    if (!updatedWorkspaceMember) {
      throw new DatabaseError(
        "Update succeeded but no row was returned for workspace member update",
      );
    }

    return updatedWorkspaceMember;
  }

  async deleteWorkspaceMember(
    userId: string,
    workspaceId: string,
  ): Promise<void> {
    const workspaceMember = await this.repo.findByOwner(userId, workspaceId);

    if (!workspaceMember) {
      throw new NotFoundError("Workspace member");
    }

    await this.repo.delete(workspaceMember.id);
  }
}
