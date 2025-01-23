"use client";
import DootedSeparator from "@/components/dooted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useLogout } from "../api/logout-api";
import DisplayServerActionResponse from "@/components/DisplayServerActionResponse";

export default function UserButton() {
  const logoutMutation = useLogout();
  const name = "Yosef Alemu";
  const email = "yosefalemu007@gmail.com";

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase();

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative">
          <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          className="w-60"
          sideOffset={10}
        >
          <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
            <Avatar className="size-[52px] border border-neutral-300">
              <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="text-sm font-medium text-neutral-900">
                {name || "User"}
              </p>
              <p className="text-sm text-neutral-500">
                {email || "User Email"}
              </p>
            </div>
          </div>
          <DootedSeparator className="mb-2" />
          <DropdownMenuItem
            className="h-10 flex items-center justify-center text-amber-700 focus:text-amber-900 focus:bg-transparent font-medium cursor-pointer"
            onClick={() => handleLogout()}
          >
            <LogOut className="size-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {logoutMutation.data && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2">
          <DisplayServerActionResponse
            data={logoutMutation.data}
            onReset={logoutMutation.reset}
            routePath="/sign-in"
          />
        </div>
      )}
      {logoutMutation.error && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2">
          <DisplayServerActionResponse
            error={logoutMutation.error}
            onReset={logoutMutation.reset}
          />
        </div>
      )}
    </>
  );
}
