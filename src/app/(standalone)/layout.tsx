import UserButton from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";

interface StandAloneLayoutProps {
  children: React.ReactNode;
}
export default function StandAloneLayout({ children }: StandAloneLayoutProps) {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4 flex flex-col gap-y-2 h-full">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={152} height={56} />
          </Link>
          <UserButton />
        </nav>
        <div className="flex-1 w-full">{children}</div>
      </div>
    </main>
  );
}
