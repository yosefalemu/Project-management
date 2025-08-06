import DashboardLayoutClient from "@/components/dashboard-layout-client";
import RightSidebar from "@/components/sidebars/right-sidebar";
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
    <div className="h-screen w-full p-0.5 flex flex-col bg-red-900 text-primary relative">
      <div className="h-8 text-center">Top</div>
      <div className="flex flex-1 p-1 gap-x-2">
        <RightSidebar />
        <Card className="flex flex-1 gap-x-2 border rounded-tr-lg rounded-br-lg">
          <Sidebar />
          <main className="flex-1">
            <DashboardLayoutClient>{children}</DashboardLayoutClient>
          </main>
        </Card>
      </div>
    </div>
  );
}
