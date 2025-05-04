"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import {
  IoPersonOutline,
  IoPersonSharp,
  IoSettingsOutline,
  IoSettingsSharp,
} from "react-icons/io5";
const routes = [
  { label: "Home", href: "", icon: GoHome, activeIcon: GoHomeFill },
  {
    label: "Task",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Setting",
    href: "/settings",
    icon: IoSettingsOutline,
    activeIcon: IoSettingsSharp,
  },
  {
    label: "Member",
    href: "/members",
    icon: IoPersonOutline,
    activeIcon: IoPersonSharp,
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const params = useParams();
  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const fullHref = `/workspaces/${params.workspaceId}${item.href}`;
        const isActive = pathname === fullHref;
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
