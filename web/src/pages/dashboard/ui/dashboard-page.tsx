import { useSession, signOut } from "@/shared/api/auth-client.ts";
import { Button } from "@/shared/ui/kit/button";

export function DashboardPage() {
  // const { data: session, isPending: isSessionPending, error } = useSession();

  // if (isSessionPending) {
  //   return <div>Loading...</div>;
  // }

  // if (!session || error) {
  //   return <div>Not authenticated</div>;
  // }

  // const { id, email, name, image } = session.user;

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
      {/* <p>Welcome, {name}</p>
      <p>{email}</p>
      {image && <img src="user.image" alt="Profile" width={48} height={48} />} */}
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  );
}
