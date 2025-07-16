import type { Metadata } from "next";
import "./globals.css";
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
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Jira-clone",
  description: "Jira clone built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <Toaster />
          <Suspense
            fallback={
              <div className="h-screen w-screen max-h-screen flex items-center justify-center overflow-hidden">
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
                  <TooltipProvider>
                    <div className="h-screen w-screen overflow-hidden bg-primary">
                      {children}
                    </div>
                  </TooltipProvider>
                  <ReactQueryDevtools
                    initialIsOpen={false}
                    buttonPosition="bottom-right"
                  />
                </QueryProviders>
              </NuqsAdapter>
            </StoreProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
