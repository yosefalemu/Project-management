import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProviders from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/store/store-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import WorkspaceModal from "@/features/workspace/components/workspace-modal";
import InviteProjectMemberModal from "@/features/projects/components/invite-project-member-modal";
import TaskModal from "@/features/tasks/components/task-modal";
import CreateProjectModal from "@/features/projects/components/project-modal";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Jira-clone",
  description: "Jira clone built with Next.js",
};

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("RootLayout rendered");
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        <Toaster />
        <Suspense
          fallback={
            <div className="h-screen w-screen bg-white flex items-center justify-center">
              Loading...
            </div>
          }
        >
          <StoreProvider>
            <NuqsAdapter>
              <QueryProviders>
                <WorkspaceModal />
                <CreateProjectModal />
                <InviteProjectMemberModal />
                <TaskModal />
                {children}
                <ReactQueryDevtools
                  initialIsOpen={false}
                  buttonPosition="bottom-right"
                />
              </QueryProviders>
            </NuqsAdapter>
          </StoreProvider>
        </Suspense>
      </body>
    </html>
  );
}
