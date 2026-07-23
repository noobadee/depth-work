import express from "express";
import { ProjectRepository } from "@/modules/projects/repository.ts";
import { ProjectService } from "@/modules/projects/service.ts";
import { ProjectController } from "@/modules/projects/controller.ts";
import { workspaceIdParamSchema } from "@/modules/workspaces/schemas.ts";
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
} from "@/modules/projects/schemas.ts";
import { validate } from "@/common/middleware/validate.ts";
import { requireAuth } from "@/middleware/auth.middleware.ts";
import {
  projectActionGuard,
  updateProjectActionGuard,
} from "@/middleware/project.middleware.ts";

const router = express.Router({ mergeParams: true });

const repository = new ProjectRepository();
const service = new ProjectService(repository);
const controller = new ProjectController(service);

router.use(requireAuth);

router.get(
  "/workspaces/:workspace_id/projects",
  validate({ params: workspaceIdParamSchema }),
  controller.getAll,
);

router.get(
  "/projects/:project_id",
  validate({ params: projectIdParamSchema }),
  controller.getOne,
);

router.post(
  "/workspaces/:workspace_id/projects",
  validate({ body: createProjectSchema, params: workspaceIdParamSchema }),
  projectActionGuard(),
  controller.create,
);

router.patch(
  "/projects/:project_id",
  validate({ body: updateProjectSchema, params: projectIdParamSchema }),
  updateProjectActionGuard(),
  controller.update,
);

router.delete(
  "/projects/:project_id",
  validate({ params: projectIdParamSchema }),
  projectActionGuard({ withProjectIdParam: true }),
  controller.delete,
);

export { router as projectsRouter };
