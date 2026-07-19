import { createFileRoute } from "@tanstack/react-router";
import RegisterPage from "@/pages/RegisterPage";

export const Route = createFileRoute("/_public/register")({
  component: RegisterPage,
});
