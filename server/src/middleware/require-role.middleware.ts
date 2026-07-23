import { ForbiddenError, NotFoundError } from "@/common/errors/index.ts";
import { requireUser } from "@/middleware/auth.middleware.ts";
import { WorkspaceMemberRepository } from "@/modules/workspace-members/repository.ts";
import type { RequestHandler } from "express";
import type { WorkspaceIdParam } from "@/modules/workspaces/schemas.ts";
import type { WorkspaceMemberParams } from "@/modules/workspace-members/schemas.ts";
import { ProjectRepository } from "@/modules/projects/repository.ts";
import type { ProjectIdParam } from "@/modules/projects/schemas.ts";

export function requireRole(
  allowedRoles: string[],
  { withUserIdParam = false }: { withUserIdParam?: boolean } = {},
): RequestHandler {
  return async (req, _res, next) => {
    const workspaceMemberRepo = new WorkspaceMemberRepository();
    const user = requireUser(req);

    if (withUserIdParam) {
      const { user_id, workspace_id } = req.params as WorkspaceMemberParams;

      const updater = await workspaceMemberRepo.findByOwner(
        user.id,
        workspace_id,
      );
      const workspaceMember = await workspaceMemberRepo.findByOwner(
        user_id,
        workspace_id,
      );

      if (!updater || !workspaceMember) {
        next(new NotFoundError("Workspace member"));
        return;
      }

      if (
        updater.role === "admin" &&
        ["owner", "admin"].includes(workspaceMember.role)
      ) {
        next(new ForbiddenError("You do not have permission or rights"));
        return;
      }

      next();
      return;
    }

    const { workspace_id } = req.params as WorkspaceIdParam;
    const updater = await workspaceMemberRepo.findByOwner(
      user.id,
      workspace_id,
    );

    if (!updater) {
      next(new NotFoundError("Workspace member"));
      return;
    }

    if (!allowedRoles.includes(updater.role)) {
      next(new ForbiddenError("You do not have permission or rights"));
      return;
    }

    next();
  };
}

// export function requireMinRole(minRole: string): RequestHandler {
//   return async (req, _res, next) => {
//     const workspaceMemberRepo = new WorkspaceMemberRepository();
//     const projectRepo = new ProjectRepository();

//     const user = requireUser(req);
//     const { project_id } = req.params as ProjectIdParam;

//     const project = await projectRepo.findById(project_id);
//     // console.log("============== this is from requiredMinRole()")
//     // IN SERVICES, ADD WHO UPDATE STATUS OR SOMEWHERE
//     // ALTERNATIVE: BUILD YOUR OWN TO SIMPLIFY EVEN THOUGH IT ISN'T DRY

//     if (!project) {
//       next(new NotFoundError("Project"));
//       return;
//     }

//     const updater = await workspaceMemberRepo.findByOwner(
//       user.id,
//       project.workspaceId,
//     );

//     if (!updater) {
//       next(new NotFoundError("Workspace member"));
//       return;
//     }

//     if (minRole === "owner" && updater.role === "admin") {
//       next(new ForbiddenError("You do not have permission or rights"));
//       return;
//     }

//     if (minRole === "admin" && ["member", "viewer"].includes(updater.role)) {
//       next(new ForbiddenError("You do not have permission or rights"));
//       return;
//     }

//     next();
//   };
// }
