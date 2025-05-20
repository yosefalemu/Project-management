import LoadingLayout from "@/components/loading-layout";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import InviteProjectMemberModal from "@/features/projects/components/invite-project-member-modal";
import CreateProjectModal from "@/features/projects/components/project-modal";
import TaskModal from "@/features/tasks/components/task-modal";
import WorkspaceModal from "@/features/workspace/components/workspace-modal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-full w-full px-0">
      <WorkspaceModal />
      <CreateProjectModal />
      <InviteProjectMemberModal />
      <TaskModal />
      <div className="flex w-full h-full gap-x-2 relative">
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
        <LoadingLayout />
      </div>
    </div>
  );
}
