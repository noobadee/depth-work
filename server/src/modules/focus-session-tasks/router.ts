import express from "express";
import { FocusSessionTaskRepository } from "@/modules/focus-session-tasks/repository.ts";
import { FocusSessionTaskService } from "@/modules/focus-session-tasks/service.ts";
import { FocusSessionTaskController } from "@/modules/focus-session-tasks/controller.ts";
import {
  createFocusSessionTaskSchema,
  updateFocusSessionTaskSchema,
  focusSessionTaskParamsSchema,
} from "@/modules/focus-session-tasks/schemas.ts";
import { focusSessionIdParamSchema } from "@/modules/focus-sessions/schemas.ts";
import { validate } from "@/common/middleware/validate.ts";
import { requireAuth } from "@/middleware/auth.middleware.ts";
import { focusSessionTaskGuard } from "@/middleware/focus-session-task.middleware.ts";

const router = express.Router({ mergeParams: true });

const repository = new FocusSessionTaskRepository();
const service = new FocusSessionTaskService(repository);
const controller = new FocusSessionTaskController(service);

router.use(requireAuth);

router.get(
  "/",
  validate({ params: focusSessionIdParamSchema }),
  controller.getAll,
);

router.post(
  "/",
  validate({
    body: createFocusSessionTaskSchema,
    params: focusSessionIdParamSchema,
  }),
  focusSessionTaskGuard(),
  controller.create,
);

router.patch(
  "/:task_id",
  validate({
    body: updateFocusSessionTaskSchema,
    params: focusSessionTaskParamsSchema,
  }),
  focusSessionTaskGuard({ withTaskIdParam: true }),
  controller.update,
);

router.delete(
  "/:task_id",
  validate({ params: focusSessionTaskParamsSchema }),
  focusSessionTaskGuard({ withTaskIdParam: true }),
  controller.delete,
);

export { router as focusSessionTasksRouter };
