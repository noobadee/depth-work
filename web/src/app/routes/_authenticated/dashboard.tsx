import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "@/pages/DashboardPage";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});
