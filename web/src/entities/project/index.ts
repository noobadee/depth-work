export {
  projectSchema,
  projectResponseSchema,
  type Project,
} from "@/entities/project/model/schema";
export {
  fetchProject,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/entities/project/api/requests";
export {
  projectsQueryOptions,
  projectQueryOptions,
} from "@/entities/project/api/queries";
export { projectKeys } from "@/entities/project/api/query-keys";
