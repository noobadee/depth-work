import { useDashboard } from "@/app/providers/dashboard-context";
import { StatCards } from "@/pages/dashboard";

export function DashboardContent() {
  const { user } = useDashboard();

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Welcome {user?.name}!</h1>
      <StatCards />
    </>
  );
}
