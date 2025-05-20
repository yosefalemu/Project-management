"use client";
import Link from "next/link";
import { IoPersonOutline, IoPersonSharp } from "react-icons/io5";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { GoHome, GoHomeFill } from "react-icons/go";

export default function ProjectSettingNavigator() {
  const pathname = usePathname();
  const projectId = useSearchParams().get("projectId");
  const workspaceId = useSearchParams().get("workspaceId");
  const routes = [
    { label: "Home", href: "", icon: GoHome, activeIcon: GoHomeFill },
    {
      label: "Members",
      href: "members",
      icon: IoPersonOutline,
      activeIcon: IoPersonSharp,
    },
  ];

  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const fullHref = item.href
          ? `/settings/project/${item.href}?workspaceId=${workspaceId}&projectId=${projectId}`
          : `/settings/project?workspaceId=${workspaceId}&projectId=${projectId}`;
        const correctedPathname = `${pathname}?workspaceId=${workspaceId}&projectId=${projectId}`;
        const isActive = fullHref === correctedPathname;
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary text-neutral-500 transition",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
}
