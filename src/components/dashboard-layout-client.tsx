"use client";

import { cn } from "@/lib/utils";
import UserProfileInfo from "@/features/auth/components/profile";
import { fontProfile } from "@/states/font/font-state";
import { userProfileViewStore } from "@/states/user-profile";
import { fonts } from "@/lib/font";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
}

export default function DashboardLayoutClient({
  children,
}: DashboardLayoutClientProps) {
  const { font } = fontProfile();
  const { isOpen } = userProfileViewStore();
  const selectedFont = fonts[font] || fonts["Inter"];

  return (
    <div
      className={cn("flex flex-1 h-[calc(100vh-3rem)]", selectedFont.className)}
    >
      <div className="flex-1 h-full">{children}</div>
      {isOpen && <UserProfileInfo />}
    </div>
  );
}
