import {
  ConflictError,
  DatabaseError,
  NotFoundError,
} from "@/common/errors/http-errors.ts";
import { UserRepository } from "@/modules/auth/repository.ts";
import type { ProjectMember } from "@/db/schema/index.ts";
import type {
  CreateProjectMemberInput,
  IProjectMemberRepository,
  IProjectMemberService,
} from "@/modules/project-members/types.ts";

export class ProjectMemberService implements IProjectMemberService {
  constructor(private readonly repo: IProjectMemberRepository) {}

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const projectMembers = await this.repo.findAllByProject(projectId);

    if (!projectMembers || projectMembers.length === 0) {
      throw new NotFoundError("Project member");
    }

    return projectMembers;
  }

  async createProjectMember(
    projectId: string,
    body: CreateProjectMemberInput,
  ): Promise<ProjectMember> {
    const userRepo = new UserRepository();

    const user = await userRepo.findByEmail(body.email);

    if (!user) {
      throw new NotFoundError("User");
    }

    const existingProjectMember = await this.repo.findByProjectMember(
      user.id,
      projectId,
    );

    if (existingProjectMember) {
      throw new ConflictError("Project member already exists");
    }

    const newProjectMember = await this.repo.create({
      projectId,
      userId: user.id,
    });

    if (!newProjectMember) {
      throw new DatabaseError(
        "Insert succeeded but no row was returned for project member creation",
      );
    }

    return newProjectMember;
  }

  async deleteProjectMember(userId: string, projectId: string): Promise<void> {
    const projectMember = await this.repo.findByProjectMember(
      userId,
      projectId,
    );

    if (!projectMember) {
      throw new NotFoundError("Project member");
    }

    await this.repo.delete(projectMember.id);
  }
}
