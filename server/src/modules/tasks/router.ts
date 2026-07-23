import express from "express";
import { TaskRepository } from "@/modules/tasks/repository.ts";
import { TaskService } from "@/modules/tasks/service.ts";
import { TaskController } from "@/modules/tasks/controller.ts";
import { workspaceIdParamSchema } from "@/modules/workspaces/schemas.ts";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
} from "@/modules/tasks/schemas.ts";
import { projectIdParamSchema } from "@/modules/projects/schemas.ts";
import { validate } from "@/common/middleware/validate.ts";
import { requireAuth } from "@/middleware/auth.middleware.ts";
import {
  createTaskActionGuard,
  taskActionGuard,
} from "@/middleware/task.middleware.ts";

const router = express.Router({ mergeParams: true });

const repository = new TaskRepository();
const service = new TaskService(repository);
const controller = new TaskController(service);

router.use(requireAuth);

router.get(
  "/workspaces/:workspace_id/tasks",
  validate({ params: workspaceIdParamSchema }),
  controller.getAll,
);

router.get(
  "/projects/:project_id/tasks",
  validate({ params: projectIdParamSchema }),
  controller.getAllUnderProject,
);

router.get(
  "/tasks/:task_id",
  validate({ params: taskIdParamSchema }),
  controller.getOne,
);

router.post(
  "/workspaces/:workspace_id/tasks",
  validate({ body: createTaskSchema, params: workspaceIdParamSchema }),
  createTaskActionGuard(),
  controller.createTask,
);

router.post(
  "/projects/:project_id/tasks",
  validate({ body: createTaskSchema, params: projectIdParamSchema }),
  createTaskActionGuard({ withProjectIdParam: true }),
  controller.createTaskUnderProject,
);

router.patch(
  "/tasks/:task_id",
  validate({ body: updateTaskSchema, params: taskIdParamSchema }),
  taskActionGuard(),
  controller.update,
);

router.delete(
  "tasks/:task_id",
  validate({ params: taskIdParamSchema }),
  taskActionGuard(),
  controller.delete,
);

export { router as tasksRouter };
