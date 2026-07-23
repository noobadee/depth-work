import { ForbiddenError, NotFoundError } from "@/common/errors/http-errors.ts";
import { requireUser } from "@/middleware/auth.middleware.ts";
import { ProjectRepository } from "@/modules/projects/repository.ts";
import { ProjectMemberRepository } from "@/modules/project-members/repository.ts";
import { WorkspaceMemberRepository } from "@/modules/workspace-members/repository.ts";
import type { RequestHandler } from "express";
import type { ProjectIdParam } from "@/modules/projects/schemas.ts";
import type { WorkspaceIdParam } from "@/modules/workspaces/schemas.ts";

export function projectActionGuard({
  withProjectIdParam = false,
}: { withProjectIdParam?: boolean } = {}): RequestHandler {
  return async (req, _res, next) => {
    const user = requireUser(req);
    const workspaceMemberRepo = new WorkspaceMemberRepository();
    const projectRepo = new ProjectRepository();

    if (withProjectIdParam) {
      const params = req.params as ProjectIdParam;

      const project = await projectRepo.findById(params.project_id);

      if (!project) {
        next(new NotFoundError("Project"));
        return;
      }

      const editor = await workspaceMemberRepo.findByOwner(
        user.id,
        project.workspaceId,
      );

      if (!editor) {
        next(new NotFoundError("Workspace member"));
        return;
      }

      if (!["owner", "admin"].includes(editor.role)) {
        next(new ForbiddenError("You do not have permission or rights"));
        return;
      }

      next();
      return;
    }

    const params = req.params as WorkspaceIdParam;

    const editor = await workspaceMemberRepo.findByOwner(
      user.id,
      params.workspace_id,
    );

    if (!editor) {
      next(new NotFoundError("Workspace member"));
      return;
    }

    if (!["owner", "admin"].includes(editor.role)) {
      next(new ForbiddenError("You do not have permission or rights"));
      return;
    }

    next();
  };
}

export function updateProjectActionGuard(): RequestHandler {
  return async (req, _res, next) => {
    const user = requireUser(req);
    const workspaceMemberRepo = new WorkspaceMemberRepository();
    const projectMemberRepo = new ProjectMemberRepository();
    const projectRepo = new ProjectRepository();

    const params = req.params as ProjectIdParam;

    const project = await projectRepo.findById(params.project_id);

    if (!project) {
      next(new NotFoundError("Project"));
      return;
    }

    const editor = await workspaceMemberRepo.findByOwner(
      user.id,
      project.workspaceId,
    );

    if (!editor) {
      next(new NotFoundError("Workspace member"));
      return;
    }

    if (["owner", "admin"].includes(editor.role)) {
      next();
      return;
    }

    if (editor.role === "viewer") {
      next(new ForbiddenError("You do not have permissions fo rights"));
      return;
    }

    // Check if workspace member has project membership
    const projectMember = await projectMemberRepo.findByProjectMember(
      user.id,
      project.project_id,
    );

    if (!projectMember) {
      next(new ForbiddenError("You do not have permissions or rights"));
      return;
    }

    next();
  };
}
