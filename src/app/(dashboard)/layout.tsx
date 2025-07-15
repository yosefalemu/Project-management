"use client";

import LoadingLayout from "@/components/loading-layout";
import UserProfileInfo from "@/components/profile/profile";
import RightSidebar from "@/components/right-sidebar";
import Sidebar from "@/components/sidebar";
import { userProfileViewStore } from "@/states/modals/user-profile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen } = userProfileViewStore();
  return (
    <div className="h-screen w-full bg-violet-500 p-0.5 flex flex-col">
      <div className="h-8 text-center">Top</div>
      <div className="flex flex-1 p-1 gap-x-2">
        <div>
          <RightSidebar />
        </div>
        <div className="flex flex-1 gap-x-2 bg-green-500 rounded-sm">
          <div>
            <Sidebar />
          </div>
          <main className="py-8 px-6 flex flex-col flex-1 bg-yellow-500">{children}</main>
          {isOpen && <UserProfileInfo />}
          <LoadingLayout />
        </div>
      </div>
    </div>
  );
}
