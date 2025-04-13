import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { DashboardNav } from "@/components/DashboardNav";
import { TeamProvider } from "@/components/TeamProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <TeamProvider>
      <DashboardNav>{children}</DashboardNav>
    </TeamProvider>
  );
} 