import { Router } from "express";
import { WorkspaceRepository } from "@/modules/workspaces/repository.ts";
import { WorkspaceService } from "@/modules/workspaces/service.ts";
import { WorkspaceController } from "@/modules/workspaces/controller.ts";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  paramIdSchema,
} from "@/modules/workspaces/schemas.ts";
import { validate } from "@/common/middleware/validate.ts";
import { requireAuth } from "@/middleware/auth.middleware.ts";

const router = Router();

const repository = new WorkspaceRepository();
const service = new WorkspaceService(repository);
const controller = new WorkspaceController(service);

router.use(requireAuth);

router.get("/", controller.getAll);

router.get(
  "/:workspace_id",
  validate({ params: paramIdSchema }),
  controller.getOne,
);

router.post("/", validate({ body: createWorkspaceSchema }), controller.create);

// TODO: transfer ownership
// router.post("/:workspace_id/transfer-ownership");

router.patch(
  "/:workspace_id",
  validate({ body: updateWorkspaceSchema, params: paramIdSchema }),
  controller.update,
);

router.delete(
  "/:workspace_id",
  validate({ params: paramIdSchema }),
  controller.delete,
);

export { router as workspacesRouter };
