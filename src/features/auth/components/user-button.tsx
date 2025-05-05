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
import { IoPersonOutline } from "react-icons/io5";
import { useLogout } from "../api/logout-api";
import { useCurrentUser } from "../api/current-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UserButton() {
  const logoutMutation = useLogout();
  const router = useRouter();
  const { data, isLoading, isError } = useCurrentUser();

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
    <>
      {isLoading ? (
        <div className="bg-neutral-200 font-medium rounded-full size-10 overflow-hidden flex items-center justify-center">
          <IoPersonOutline className="text-neutral-500 text-lg" />
        </div>
      ) : isError ? (
        <div>TODO::HANDLE ERROR</div>
      ) : data ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="outline-none relative">
            <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
              <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                Y
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
                  Y
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-sm font-medium text-neutral-900">Y</p>
                <p className="text-sm text-neutral-500">Y</p>
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
      ) : (
        <div className="bg-neutral-200 font-medium rounded-full size-10 overflow-hidden flex items-center justify-center">
          <IoPersonOutline className="text-neutral-500 text-lg" />
        </div>
      )}
    </>
  );
}
