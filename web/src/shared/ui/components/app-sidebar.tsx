import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/kit/sidebar";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  ClipboardList,
  Focus,
  Folder,
  House,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/kit/dropdown-menu";
import { useSession } from "@/shared/api/auth-client";
import { useQuery } from "@tanstack/react-query";
import { workspacesQueryOptions } from "@/entities/workspace";
import { useState } from "react";

const items = [
  { title: "Home", url: "/", icon: House },
  { title: "Projects", url: "/projects", icon: Folder },
  { title: "Tasks", url: "/tasks", icon: ClipboardList },
  { title: "Focus", url: "/focus", icon: Focus },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const {
    data: sessionData,
    isPending: isSessionDataPending,
    error: sessionDataError,
  } = useSession();

  const {
    data: workspacesResult,
    isLoading: isWorkspacesLoading,
    error: workspacesError,
  } = useQuery(workspacesQueryOptions());

  const workspaces = workspacesResult?.data ?? [];
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null,
  );
  const currentWorkspace =
    workspaces.find((w) => w.workspace_id === selectedWorkspaceId) ??
    workspaces?.[0];

  if (isSessionDataPending || isWorkspacesLoading) {
    return <div>Loading...</div>;
  }

  if (!sessionData || sessionDataError) {
    return <div>Not authenticated</div>;
  }

  if (workspacesError) {
    return <div>Unexpected error loading workspaces data</div>;
  }

  if (workspaces.length === 0) {
    navigate({ to: "/onboarding" });
    return;
  }

  return (
    <Sidebar collapsible="icon" className="pt-2">
      <SidebarHeader>
        <SidebarMenu className="flex flex-col gap-6">
          <SidebarMenuItem className="flex items-center gap-2 px-2">
            <span className="px-2 py-1 flex items-center justify-center rounded-md bg-gray-900 text-white text-xs font-bold">
              D
            </span>
            <span className="group-data-[collapsible=icon]:hidden font-semibold">
              Depthwork
            </span>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <SidebarMenuButton>
                  <User />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {currentWorkspace.name}
                  </span>{" "}
                  <ChevronDown className="group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    onClick={() =>
                      setSelectedWorkspaceId(workspace.workspace_id)
                    }
                    key={workspace.workspace_id}
                  >
                    {workspace.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <Link to={item.url} className="flex gap-2 w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
