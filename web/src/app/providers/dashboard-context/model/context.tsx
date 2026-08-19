import { createContext, use, type ReactNode } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { workspaceQueryOptions } from "@/entities/workspace";
import { sessionQueryOptions } from "@/entities/session";
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

interface DashboardContextValue {
  user: User;
  stats: Stats;
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
  const projects = projectsResult.data;
  const tasks = tasksResult.data;

  const user: User = {
    id: userId,
    name: userName,
  };

  const stats: Stats = {
    totalProjects: projects.length,
    completedProjects: projects.filter((p) => p.status === "completed").length,
    myTasks: tasks.filter(
      (t) => t.createdBy === userId || t.assignedTo === userId,
    ).length,
    overDue: 0,
  };

  const workspaceName = workspace.name;

  return (
    <DashboardContext value={{ user, stats, workspaceName }}>
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
