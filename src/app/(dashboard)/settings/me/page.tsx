"use client";
import { LogOut } from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useLogout } from "@/features/auth/api/logout-api";

export default function ProfileSettings() {
  const logoutMutation = useLogout();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [themeChecked, setThemeChecked] = useState<boolean>(
    resolvedTheme === "dark"
  );

  useEffect(() => {
    setThemeChecked(resolvedTheme === "dark");
  }, [resolvedTheme]);


  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        router.push("/sign-in");
      },
      onError: () => {
        toast.error("An error occured while logging out");
      },
    });
  };
  return (
    <div className="flex space-x-4 h-full">
      <div className="w-1/2 border-2 p-4">Column one</div>
      <div className="w-1/2 flex flex-col justify-end border-2 p-4">
        <div className="flex items-center space-x-2 px-4 py-2">
          <Label htmlFor="airplane-mode">Dark Mode</Label>
          <Switch
            id="dark-mode"
            checked={themeChecked}
            onCheckedChange={() => {
              const newTheme = themeChecked ? "light" : "dark";
              setTheme(newTheme);
              setThemeChecked(!themeChecked);
            }}
          />
        </div>
        <div
          className="flex items-center space-x-2 px-4 py-2"
          onCanPlay={handleLogout}
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </div>
      </div>
    </div>
  );
}
