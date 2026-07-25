import { ForbiddenError, NotFoundError } from "@/common/errors/http-errors.ts";
import { requireUser } from "@/middleware/auth.middleware.ts";
import { TaskRepository } from "@/modules/tasks/repository.ts";
import { WorkspaceMemberRepository } from "@/modules/workspace-members/repository.ts";
import type { RequestHandler } from "express";
import type { TaskIdParam } from "@/modules/tasks/schemas.ts";
import type { CreateFocusSessionTaskBody } from "@/modules/focus-session-tasks/schemas.ts";

export function focusSessionTaskGuard({
  withTaskIdParam = false,
}: { withTaskIdParam?: boolean } = {}): RequestHandler {
  return async (req, _res, next) => {
    const user = requireUser(req);
    const workspaceMemberRepo = new WorkspaceMemberRepository();
    const taskRepo = new TaskRepository();

    let taskIdParam: string;

    if (withTaskIdParam) {
      const { task_id } = req.params as TaskIdParam;
      taskIdParam = task_id;
    } else {
      const body = req.body as CreateFocusSessionTaskBody;
      taskIdParam = body.taskId;
    }

    const task = await taskRepo.findById(taskIdParam);

    if (!task) {
      next(new NotFoundError("Task"));
      return;
    }

    const editor = await workspaceMemberRepo.findByOwner(
      user.id,
      task.workspace_id,
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
      next(new ForbiddenError("You do not have permissions or rights"));
      return;
    }

    if (![task.createdBy, task.assignedTo].includes(editor.userId)) {
      next(new ForbiddenError("You do not have permissions or rights"));
      return;
    }

    next();
  };
}
