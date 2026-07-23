import type { NewProjectMember, ProjectMember } from "@/db/schema/index.ts";

export interface IProjectMemberRepository {
  findAllByProject(projectId: string): Promise<ProjectMember[] | null>;
  findByProjectMember(
    userId: string,
    projectId: string,
  ): Promise<ProjectMember | null>;
  create(data: NewProjectMember): Promise<ProjectMember | null>;
  delete(id: string): Promise<void>;
}

export interface IProjectMemberService {
  getProjectMembers(projectId: string): Promise<ProjectMember[]>;
  createProjectMember(
    projectId: string,
    body: CreateProjectMemberInput,
  ): Promise<ProjectMember>;
  deleteProjectMember(userId: string, projectId: string): Promise<void>;
}

export interface CreateProjectMemberInput {
  email: string;
}
