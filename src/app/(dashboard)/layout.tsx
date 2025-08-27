import DashboardLayoutClient from "@/components/dashboard-layout-client";
import LeftSidebar from "@/components/sidebars/left-sidebar";
import Sidebar from "@/components/sidebars/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Card } from "@/components/ui/card";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="p-0.5 flex flex-col">
      <div className="h-8 text-center">Top</div>
      <div className="flex p-1 relative">
        <LeftSidebar />
        <Card className="flex flex-1 border rounded-sm rounded-tr-lg rounded-br-lg relative">
          <Sidebar />
          <main className="flex-1 ml-56">
            <DashboardLayoutClient>{children}</DashboardLayoutClient>
          </main>
        </Card>
      </div>
    </div>
  );
}
