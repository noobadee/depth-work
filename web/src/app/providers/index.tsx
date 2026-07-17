import AppQueryProvider from "@/app/providers/query-client";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppQueryProvider>{children}</AppQueryProvider>;
}
