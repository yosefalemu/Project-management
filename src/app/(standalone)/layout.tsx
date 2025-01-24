import UserButton from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";

interface StandAloneLayoutProps {
  children: React.ReactNode;
}
export default function StandAloneLayout({ children }: StandAloneLayoutProps) {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={152} height={56} />
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}
