import { createContext, use, type ReactNode } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { sessionQueryOptions } from "@/entities/session";
import { workspaceQueryOptions } from "@/entities/workspace";
import { projectsQueryOptions } from "@/entities/project";
import { tasksQueryOptions } from "@/entities/task";

interface User {
  id: string;
  name: string;
}

interface Stats {
  totalProjects: number;
  completedProjects: number;
  myTasks: number;
  overDue: number;
}

interface Project {
  project_id: string;
  title: string;
  description: string | null;
}

interface Task {
  task_id: string;
  title: string;
  description: string | null;
}

interface DashboardContextValue {
  user: User;
  stats: Stats;
  projects: Project[];
  tasks: Task[];
  workspaceName: string;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data: sessionData } = useSuspenseQuery(sessionQueryOptions);
  const { data: workspace } = useSuspenseQuery(workspaceQueryOptions(""));
  const { data: projectsResult } = useSuspenseQuery(
    projectsQueryOptions(workspace.workspace_id),
  );
  const { data: tasksResult } = useSuspenseQuery(
    tasksQueryOptions(workspace.workspace_id),
  );

  const { id: userId = "", name: userName = "" } = sessionData?.user ?? {};
  const projectList = projectsResult.data;
  const taskList = tasksResult.data;

  const user: User = {
    id: userId,
    name: userName,
  };

  const stats: Stats = {
    totalProjects: projectList.length,
    completedProjects: projectList.filter((p) => p.status === "completed")
      .length,
    myTasks: taskList.filter(
      (t) => t.createdBy === userId || t.assignedTo === userId,
    ).length,
    overDue: 0,
  };

  const projects: Project[] = projectList.map(
    ({ project_id, title, description }) => ({
      project_id,
      title,
      description,
    }),
  );

  const tasks: Task[] = taskList.map(({ task_id, title, description }) => ({
    task_id,
    title,
    description,
  }));

  const workspaceName = workspace.name;

  return (
    <DashboardContext value={{ user, stats, projects, tasks, workspaceName }}>
      {children}
    </DashboardContext>
  );
}

export function useDashboard() {
  const context = use(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboard must be used within <DashboardContextProvider>",
    );
  }
  return context;
}
