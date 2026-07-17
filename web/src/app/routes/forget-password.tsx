import { createFileRoute } from "@tanstack/react-router";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";

export const Route = createFileRoute("/forget-password")({
  component: ForgotPasswordPage,
});
