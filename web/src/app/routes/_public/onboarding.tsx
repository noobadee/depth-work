import { OnboardingPage } from "@/pages/onboarding";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/onboarding")({
  component: OnboardingPage,
});
