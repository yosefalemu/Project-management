import Image from "next/image";
import Link from "next/link";

import DootedSeparator from "@/components/dooted-separator";
import Navigation from "@/components/navigation";

export default function Sidebar() {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/home">
        <Image src="/logo.svg" alt="logo" width={164} height={48} />
      </Link>
      <DootedSeparator className="my-4" />
      <Navigation />
    </aside>
  );
}
