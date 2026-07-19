import { Router } from "express";
import { WorkspaceRepository } from "@/modules/workspaces/repository.ts";
import { WorkspaceService } from "@/modules/workspaces/service.ts";
import { WorkspaceController } from "@/modules/workspaces/controller.ts";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  workspaceIdSchema,
} from "@/modules/workspaces/schemas.ts";
import { validate } from "@/common/middleware/validate.ts";
import { requireAuth } from "@/middleware/auth.middleware.ts";

const router = Router();

const repository = new WorkspaceRepository();
const service = new WorkspaceService(repository);
const controller = new WorkspaceController(service);

router.use(requireAuth);

router.get("/", controller.getAll);

router.get("/:id", validate({ params: workspaceIdSchema }), controller.getOne);

router.post("/", validate({ body: createWorkspaceSchema }), controller.create);

router.patch(
  "/:id",
  validate({ body: updateWorkspaceSchema, params: workspaceIdSchema }),
  controller.update,
);

router.delete(
  "/:id",
  validate({ params: workspaceIdSchema }),
  controller.delete,
);

export { router as workspacesRouter };
