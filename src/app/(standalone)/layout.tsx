import LoadingLayout from "@/components/loading-layout";
import UserButton from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";

interface StandAloneLayoutProps {
  children: React.ReactNode;
}
export default function StandAloneLayout({ children }: StandAloneLayoutProps) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="flex flex-col h-full relative">
        <nav className="mx-auto max-w-screen-2xl w-full flex justify-between items-center h-[73px]">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={152} height={56} />
          </Link>
          <UserButton />
        </nav>
        <div className="mx-auto max-w-screen-2xl flex-1 w-full">{children}</div>
        <LoadingLayout />
      </div>
    </main>
  );
}
