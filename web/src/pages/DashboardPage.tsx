import { useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession.ts";
import { signOut } from "../lib/auth.client.ts";

export default function DashboardPage() {
  const { user } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <p>{user?.email}</p>
      {user?.image && <img src="user.image" alt="Profile" width={48} height={48} />}
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  )
}