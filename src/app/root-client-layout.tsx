// app/root-client-layout.tsx
"use client";
import {
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Poppins,
  Nunito,
  Source_Sans_3,
  Raleway,
  Ubuntu,
  Merriweather,
  Oswald,
  Playfair_Display,
  PT_Sans,
  Noto_Sans,
} from "next/font/google";
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
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fontProfile } from "@/states/font/font-state";

// Define font loaders
const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const openSans = Open_Sans({ subsets: ["latin"] });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });
const nunito = Nunito({ subsets: ["latin"] });
const sourceSansPro = Source_Sans_3({ subsets: ["latin"] });
const raleway = Raleway({ subsets: ["latin"] });
const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["400", "700"] });
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const oswald = Oswald({ subsets: ["latin"] });
const playfairDisplay = Playfair_Display({ subsets: ["latin"] });
const ptSans = PT_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const notoSans = Noto_Sans({ subsets: ["latin"] });

const fonts: Record<string, any> = {
  Inter: inter,
  Roboto: roboto,
  "Open Sans": openSans,
  Lato: lato,
  Montserrat: montserrat,
  Poppins: poppins,
  Nunito: nunito,
  "Source Sans Pro": sourceSansPro,
  Raleway: raleway,
  Ubuntu: ubuntu,
  Merriweather: merriweather,
  Oswald: oswald,
  "Playfair Display": playfairDisplay,
  "PT Sans": ptSans,
  "Noto Sans": notoSans,
};

export default function RootClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { font } = fontProfile();
  const selectedFont = fonts[font] || fonts["Inter"];

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
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
                <div
                  className={cn(
                    selectedFont.className,
                    "antialiased h-screen w-screen overflow-hidden bg-primary"
                  )}
                >
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
  );
}
