import {
  createContext,
  use,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { workspaceQueryOptions } from "@/entities/workspace";
import { projectsQueryOptions } from "@/entities/project";
import {
  createProjectFormSchema,
  useCreateProject,
  type CreateProjectFormValues,
} from "@/features/project";
import {
  useForm,
  type Control,
  type FieldErrors,
  type FieldValues,
  type SubmitHandler,
  type UseFormHandleSubmit,
  type UseFormRegister,
  type UseFormSetError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type ProjectStatuses =
  "pending" | "in_progress" | "completed" | "archived" | "all";

type ProjectSelectStatuses =
  "pending" | "in_progress" | "completed" | "archived";

interface Project {
  project_id: string;
  title: string;
  description: string | null;
  status: Omit<ProjectStatuses, "all">;
}

interface ProjectStatus {
  label: string;
  value: ProjectStatuses;
}

interface ProjectSelectStatus {
  label: string;
  value: ProjectSelectStatuses;
}

interface FormState<T extends FieldValues> {
  errors: FieldErrors<T>;
  isSubmitting: boolean;
}

interface ProjectsContextValue {
  openCreateProjectDialog: boolean;
  setOpenCreateProjectDialog: Dispatch<SetStateAction<boolean>>;
  workspaceName: string;
  projects: Project[];
  projectLabelStatuses: ProjectSelectStatus[];
  projectSortStatuses: ProjectStatus[];
  projectStatus: ProjectStatuses;
  setProjectStatus: Dispatch<SetStateAction<ProjectStatuses>>;
  onCreateProject: {
    control: Control<CreateProjectFormValues>;
    register: UseFormRegister<CreateProjectFormValues>;
    handleSubmit: UseFormHandleSubmit<CreateProjectFormValues>;
    formState: FormState<CreateProjectFormValues>;
    setError: UseFormSetError<CreateProjectFormValues>;
    onSubmit: (data: CreateProjectFormValues) => void;
  };
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export function ProjectsContextProvider({ children }: { children: ReactNode }) {
  const { data: workspace } = useSuspenseQuery(workspaceQueryOptions(""));
  const { data: projectsResult } = useSuspenseQuery(
    projectsQueryOptions(workspace.workspace_id),
  );
  const createProject = useCreateProject();

  const workspaceName = workspace.name;

  const [openCreateProjectDialog, setOpenCreateProjectDialog] =
    useState<boolean>(false);
  const [projectStatus, setProjectStatus] = useState<ProjectStatuses>("all");

  const projectLabelStatuses: ProjectSelectStatus[] = [
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
    { label: "Archived", value: "archived" },
  ];

  const projectSortStatuses: ProjectStatus[] = [
    { label: "All", value: "all" },
    ...projectLabelStatuses,
  ];

  const newProjects: Project[] = projectsResult.data.map((project) => ({
    project_id: project.project_id,
    title: project.title,
    description: project.description,
    status: project.status,
  }));

  const projects =
    projectStatus !== "all"
      ? newProjects.filter((p) => p.status === projectStatus)
      : newProjects;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValues,
  } = useForm<CreateProjectFormValues>({
    defaultValues: {
      title: "",
      description: null,
      status: "pending",
      startDate: null,
      dueDate: null,
      position: undefined,
    },
    resolver: zodResolver(createProjectFormSchema),
  });

  const formReset = () => {
    setTimeout(() => {
      setValues({
        title: "",
        description: null,
        status: "pending",
        startDate: null,
        dueDate: null,
        position: undefined,
      });
    }, 300);
  };

  const onSubmit: SubmitHandler<CreateProjectFormValues> = async (data) => {
    try {
      createProject.mutate({ workspaceId: workspace.workspace_id, ...data });
    } catch (err) {
      setError("root", {
        message: "Failed to create a project",
      });
      console.error("Error:", err);
      return;
    }

    setOpenCreateProjectDialog(false); // Close dialog
    formReset(); // Reset create project form values
  };

  const onCreateProject = {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    onSubmit,
  };

  useEffect(() => {
    if (!openCreateProjectDialog) {
      formReset();
    }
  }, [openCreateProjectDialog]);

  return (
    <ProjectsContext
      value={{
        openCreateProjectDialog,
        setOpenCreateProjectDialog,
        workspaceName,
        projects,
        projectLabelStatuses,
        projectSortStatuses,
        projectStatus,
        setProjectStatus,
        onCreateProject,
      }}
    >
      {children}
    </ProjectsContext>
  );
}

export function useProjects() {
  const context = use(ProjectsContext);
  if (!context) {
    throw new Error(
      "useProjects must be used within <ProjectsContextProvider>",
    );
  }
  return context;
}
