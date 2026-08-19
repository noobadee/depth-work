import { DashboardContextProvider } from "@/app/providers/dashboard-context";
import { DashboardContent } from "@/pages/dashboard";

export function DashboardPage() {
  return (
    <DashboardContextProvider>
      <DashboardContent />
    </DashboardContextProvider>
  );
}
