import { redirect } from "@tanstack/react-router";
import { useSession, signOut } from "@/shared/api/auth-client.ts";

export default function DashboardPage() {
  const data = useSession();
  const { user } = data;

  const handleSignOut = async () => {
    await signOut();
    redirect({ to: "/login" });
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <p>{user?.email}</p>
      {user?.image && (
        <img src="user.image" alt="Profile" width={48} height={48} />
      )}
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
