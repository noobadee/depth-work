import { createFileRoute } from "@tanstack/react-router";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";

export const Route = createFileRoute("/_public/forget-password")({
  component: ForgotPasswordPage,
});
