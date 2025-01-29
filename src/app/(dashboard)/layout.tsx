import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import CreateWorkspaceModal from "@/features/workspace/components/create-workspace-modal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModal />
      <div className="flex w-full h-full gap-x-2">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full flex flex-col min-h-screen">
          <Navbar />
          <div className="max-w-screen-2xl flex-1">
            <main className="h-fullz py-8 px-6 flex-col min-h-full">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
