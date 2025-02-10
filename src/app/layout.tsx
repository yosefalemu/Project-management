import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProviders from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/store/store-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        <Toaster position="top-right" richColors />
        <StoreProvider>
          <QueryProviders>
            {children}
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-right"
            />
          </QueryProviders>
        </StoreProvider>
      </body>
    </html>
  );
}
