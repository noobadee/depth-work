import { useQuery } from "@tanstack/react-query";
import { workspacesQueryOptions } from "@/entities/workspace";
import OnboardingCard from "@/shared/ui/components/onboarding-card";
import { useNavigate } from "@tanstack/react-router";

export function OnboardingPage() {
  const navigate = useNavigate();

  const {
    data: workspacesResult,
    isLoading: isWorkspacesLoading,
    error: workspacesError,
  } = useQuery(workspacesQueryOptions());

  if (isWorkspacesLoading) {
    return <div>Loading...</div>;
  }

  if (workspacesError) {
    return <div>Unexpected error loading workspaces data</div>;
  }

  if (workspacesResult?.data.length !== 0) {
    navigate({ to: "/$workspaceId/dashboard" });
    return;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <OnboardingCard />
    </div>
  );
}
