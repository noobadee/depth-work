import { useSession, signOut } from "@/shared/api/auth-client.ts";
import { useQuery } from "@tanstack/react-query";
import { workspacesQueryOptions } from "@/entities/workspace";

export default function DashboardPage() {
  const { data: session, isPending, error } = useSession();
  const { data: workspaces, isLoading } = useQuery(workspacesQueryOptions());

  if (isPending && isLoading) {
    return <div>Loading...</div>;
  }

  if (!session || error) {
    return <div>Not authenticated</div>;
  }

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    });
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {session.user.name}</p>
      <p>{session.user.email}</p>
      {session.user.image && (
        <img src="user.image" alt="Profile" width={48} height={48} />
      )}
      <button onClick={handleSignOut}>Sign out</button>

      <h3>Workspaces</h3>
      <ul>
        {workspaces?.data.map((workspace) => (
          <li key={workspace.workspace_id}>{workspace.name}</li>
        ))}
      </ul>
    </div>
  );
}
