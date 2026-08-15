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
import { Link } from "@tanstack/react-router";
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

const items = [
  { title: "Home", url: "/", icon: House },
  { title: "Projects", url: "/projects", icon: Folder },
  { title: "Tasks", url: "/tasks", icon: ClipboardList },
  { title: "Focus", url: "/focus", icon: Focus },
];

export function AppSidebar() {
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
                    Select Workspace
                  </span>{" "}
                  <ChevronDown />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem>Workspace 1</DropdownMenuItem>
                <DropdownMenuItem>Workspace 2</DropdownMenuItem>
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
