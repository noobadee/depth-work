import { useDashboard } from "@/app/providers/dashboard-context";
import { StatCards } from "./stat-cards";

export function DashboardHeader() {
  const { user } = useDashboard();

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-8">Welcome {user?.name}!</h1>
      <StatCards />
    </div>
  );
}
