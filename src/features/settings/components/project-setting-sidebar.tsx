import DootedSeparator from "@/components/dooted-separator";
import Image from "next/image";
import Link from "next/link";
import ProjectSettingNavigator from "@/features/settings/components/Navigation";

export default function ProjectSettingSidebar() {
  return (
    <aside className="h-full bg-neutral-200 p-4 w-full">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={164} height={48} />
      </Link>
      <DootedSeparator className="my-4" />
      <ProjectSettingNavigator />
    </aside>
  );
}
