import { useSession, signOut } from "@/shared/api/auth-client.ts";
import { useQuery } from "@tanstack/react-query";
import { workspacesQueryOptions } from "@/entities/workspace";

export function DashboardPage() {
  const { data: session, isPending: isSessionPending, error } = useSession();
  const { data: workspaces, isLoading: isWorkspacesLoading } = useQuery(
    workspacesQueryOptions(),
  );

  if (isSessionPending && isWorkspacesLoading) {
    return <div>Loading...</div>;
  }

  if (!session || error) {
    return <div>Not authenticated</div>;
  }

  const { id, email, name, image } = session.user;

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
      <p>Welcome, {name}</p>
      <p>{email}</p>
      {image && <img src="user.image" alt="Profile" width={48} height={48} />}
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
