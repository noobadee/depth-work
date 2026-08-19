import { Outlet, redirect, createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/shared/ui/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/shared/ui/kit/sidebar";
import { workspacesQueryOptions } from "@/entities/workspace";

export const Route = createFileRoute("/_authenticated/$workspaceId")({
  loader: async ({ context, params }) => {
    const workspacesResult = await context.queryClient.ensureQueryData(
      workspacesQueryOptions(),
    );

    const hasAccess = workspacesResult.data.some(
      (d) => d.workspace_id === params.workspaceId,
    );

    if (!hasAccess) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main>
        <SidebarTrigger />
        <div className="m-8">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
