import { AppSidebar } from "@/shared/ui/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/shared/ui/kit/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!context.session?.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
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
