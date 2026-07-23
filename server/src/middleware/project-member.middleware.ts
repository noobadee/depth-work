import { ForbiddenError, NotFoundError } from "@/common/errors/http-errors.ts";
import { requireUser } from "@/middleware/auth.middleware.ts";
import { ProjectRepository } from "@/modules/projects/repository.ts";
import { WorkspaceMemberRepository } from "@/modules/workspace-members/repository.ts";
import type { RequestHandler } from "express";
import type { WorkspaceMember } from "@/db/schema/index.ts";
import type { ProjectIdParam } from "@/modules/projects/schemas.ts";
import type { ProjectMemberParams } from "@/modules/project-members/schemas.ts";

export function projectMemberGuard({
  withUserIdParam = false,
}: { withUserIdParam?: boolean } = {}): RequestHandler {
  return async (req, _res, next) => {
    const user = requireUser(req);
    const workspaceMemberRepo = new WorkspaceMemberRepository();
    const projectRepo = new ProjectRepository();

    let editor: WorkspaceMember | null;
    let targetMember: WorkspaceMember | null;

    const params = req.params as ProjectIdParam;

    const project = await projectRepo.findById(params.project_id);

    if (!project) {
      next(new NotFoundError("Project"));
      return;
    }

    editor = await workspaceMemberRepo.findByOwner(
      user.id,
      project.workspaceId,
    );

    if (!editor) {
      next(new NotFoundError("Workspace member"));
      return;
    }

    if (withUserIdParam) {
      const params = req.params as ProjectMemberParams;

      targetMember = await workspaceMemberRepo.findByOwner(
        params.user_id,
        project.workspaceId,
      );

      if (!targetMember) {
        next(new NotFoundError("Workspace member"));
        return;
      }

      if (
        editor.role === "admin" &&
        ["owner", "admin"].includes(targetMember.role)
      ) {
        next(new ForbiddenError("You do not have permission or right"));
        return;
      }
    }

    if (!["owner", "admin"].includes(editor.role)) {
      next(new ForbiddenError("You do not have permission or rights"));
      return;
    }

    next();
  };
}
