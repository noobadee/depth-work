import { UserRepository } from "@/modules/auth/repository.ts";
import {
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
    creatorId: string,
    data: CreateWorkspaceMemberInput,
  ): Promise<WorkspaceMember> {
    const inviter = await this.repo.findByWorkspaceUserId(
      data.workspaceId,
      creatorId,
    );

    if (!inviter) {
      throw new NotFoundError("Workspace member");
    }

    if (["member", "viewer"].includes(inviter.role)) {
      throw new ForbiddenError(
        "You do not have permission to create a workspace member",
      );
    }

    const userRepo = new UserRepository();

    const invitedUser = await userRepo.findByEmail(data.inviteeEmail);

    if (!invitedUser) {
      throw new NotFoundError("User");
    }

    const newWorkspaceMember = await this.repo.create({
      workspaceId: data.workspaceId,
      userId: invitedUser.id,
      role: data.role,
    });

    if (!newWorkspaceMember) {
      throw new DatabaseError(
        "Insert succeeded but no row was returned for workspace member creation",
      );
    }

    return newWorkspaceMember;
  }

  async updateWorkspaceMember(
    params: { id: string },
    userId: string,
    data: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMember> {
    const updator = await this.repo.findByWorkspaceUserId(
      data.workspaceId,
      userId,
    );
    const workspaceMember = await this.repo.findById(params.id);

    if (!updator || !workspaceMember) {
      throw new NotFoundError("Workspace member");
    }

    if (
      ["member", "viewer"].includes(updator.role) ||
      (["admin"].includes(updator.role) &&
        ["owner"].includes(workspaceMember.role))
    ) {
      throw new ForbiddenError(
        "You do not have permission to update a workspace member",
      );
    }

    const updatedWorkspaceMember = await this.repo.update(params.id, data);

    if (!updatedWorkspaceMember) {
      throw new DatabaseError(
        "Update succeeded but no row was returned for workspace member update",
      );
    }

    return updatedWorkspaceMember;
  }

  async deleteWorkspaceMember(
    params: { id: string },
    body: { workspaceId: string },
    userId: string,
  ): Promise<void> {
    const deletor = await this.repo.findByWorkspaceUserId(
      body.workspaceId,
      userId,
    );
    const workspaceMember = await this.repo.findById(params.id);

    if (!deletor || !workspaceMember) {
      throw new NotFoundError("Workspace member");
    }

    if (
      ["member", "viewer"].includes(deletor.role) ||
      (["admin"].includes(deletor.role) &&
        ["owner"].includes(workspaceMember.role))
    ) {
      throw new ForbiddenError(
        "You do not have permission to remove a workspace member",
      );
    }

    await this.repo.delete(params.id);
  }
}
