import Image from "next/image";
import Link from "next/link";

import DootedSeparator from "@/components/dooted-separator";
import Navigation from "@/components/navigation";
import WorkspaceSwitcher from "./workspace-switcher";
import Projects from "./projects";

export default function Sidebar() {
  return (
    <aside className="h-full bg-neutral-200 p-4 w-full">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={164} height={48} />
      </Link>
      <DootedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DootedSeparator className="my-4" />
      <Navigation />
      <DootedSeparator className="my-4" />
      <Projects />
    </aside>
  );
}
