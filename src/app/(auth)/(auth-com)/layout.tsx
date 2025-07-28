import MaximumSizeWrapper from "@/components/maximum-size-wrapper";
import { ModeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="mx-auto flex flex-col min-h-screen max-w-screen-2xl">
      <nav className="flex items-center justify-between py-2 px-4 shadow-md bg-primary-foreground">
        <MaximumSizeWrapper className="flex items-center justify-between w-full">
          <div className="relative w-28 h-12">
            <Image
              src="/images/logo-text-blue.png"
              fill
              alt="logo"
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/blogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              Blogs
            </Link>
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              Terms
            </Link>
            <Link
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              Privacy Policy
            </Link>
            <ModeToggle />
          </div>
        </MaximumSizeWrapper>
      </nav>
      <div className="flex flex-col flex-1 items-center justify-center">
        {children}
      </div>
    </div>
  );
}
