"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="bg-neutral-100">
      <div className="mx-auto flex flex-col min-h-screen max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Image src="/logo.svg" width={152} height={56} alt="logo" />
          <Button variant="ghost">
            <Link href="/blogs" target="_blank" rel="noopener noreferrer">
              Blogs
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col flex-1 items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}
