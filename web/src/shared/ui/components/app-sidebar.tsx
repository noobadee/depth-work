import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  ClipboardList,
  Focus,
  Folders,
  House,
  User,
} from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { sessionQueryOptions } from "@/entities/session";
import {
  workspaceQueryOptions,
  workspacesQueryOptions,
} from "@/entities/workspace";
import { signOut } from "@/shared/api/auth-client";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/kit/dropdown-menu";
import { Button } from "@/shared/ui/kit/button";

const items = [
  { title: "Dashboard", url: "/", icon: House },
  { title: "Projects", url: "/$workspaceId/projects", icon: Folders },
  { title: "Tasks", url: "/$workspaceId/tasks", icon: ClipboardList },
  { title: "Focus", url: "/$workspaceId/focus", icon: Focus },
];

export function AppSidebar() {
  const navigate = useNavigate();

  // const { data: sessionData } = useSuspenseQuery(sessionQueryOptions);

  const { data: workspacesResult } = useSuspenseQuery(workspacesQueryOptions());
  const workspaces = workspacesResult.data;

  const { data: currentWorkspace } = useSuspenseQuery(
    workspaceQueryOptions(""),
  );

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    });
  };

  const selectWorkspace = (newId: string) => {
    navigate({ to: "/$workspaceId/dashboard", params: { workspaceId: newId } });
  };

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
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton>
                    <User />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {currentWorkspace.name}
                    </span>{" "}
                    <ChevronDown className="group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                }
              ></DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    onClick={() => selectWorkspace(workspace.workspace_id)}
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
              <Button onClick={handleSignOut}>Sign out</Button>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
