"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WorkspaceSwitcher from "../workspace-switcher";
import { useGetUserWorkspaces } from "@/features/workspace/api/get-workspaces-api";
import WorkspaceAvatar from "@/features/workspace/components/workspace-avatar";
import { Skeleton } from "../ui/skeleton";
import { useParams } from "next/navigation";
import DirectMessage from "../direct-message";
import { useBetterAuthGetUser } from "@/features/auth/api/better-get-user";
import MemberAvatar from "@/features/members/components/member-avatar";
import UserProfile from "./user-profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "../ui/drawer";
import Preferences from "./preferences/preferences";
import { usePreferenceModalStore } from "@/states/modals/user-preference";
import { useState, useRef, useEffect } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { useAccountModalStore } from "@/states/modals/account-setting";
import AccountSetting from "@/components/sidebars/account-settings/account-setting";
import { fonts } from "@/lib/font";
import { fontProfile } from "@/states/font/font-state";
import { cn } from "@/lib/utils";
import WorkspaceSettingComponent from "@/features/workspace/components/workspace-setting";
import { Button } from "../ui/button";
import { useMedia } from "react-use";
import { House, MessageCircleMore, Settings } from "lucide-react";

export default function LeftSidebar() {
  const params = useParams();
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const dmsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [workspaceTooltipOpen, setWorkspaceTooltipOpen] = useState(false);
  const [dmsTooltipOpen, setDmsTooltipOpen] = useState<boolean>(false);
  const [userProfileTooltipOpen, setUserProfileTooltipOpen] =
    useState<boolean>(false);
  const [workspaceSettingDialogOpen, setWorkspaceSettingDialogOpen] =
    useState<boolean>(false);

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
  } = useBetterAuthGetUser();
  const {
    data: workspaces,
    isLoading: isWorkspacesLoading,
    isError: isWorkspacesError,
  } = useGetUserWorkspaces();
  const { font } = fontProfile();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (workspaceRef.current &&
          !workspaceRef.current.contains(event.target as Node) &&
          workspaceTooltipOpen) ||
        (dmsRef &&
          !dmsRef.current?.contains(event.target as Node) &&
          dmsTooltipOpen) ||
        (profileRef &&
          !profileRef.current?.contains(event.target as Node) &&
          userProfileTooltipOpen)
      ) {
        setWorkspaceTooltipOpen(false);
        setDmsTooltipOpen(false);
        setUserProfileTooltipOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [workspaceTooltipOpen, dmsTooltipOpen, userProfileTooltipOpen]);

  const [ConfirmSignOut, confirm] = useConfirm(
    "Sign out",
    `Are you sure you want to sign out from ${currentUser?.[0]?.name}.jslack.com?`,
    {
      variant: "destructive",
      confirmLabel: "Sign out",
      cancelLabel: "Cancel",
    }
  );

  if (isWorkspacesLoading || isCurrentUserLoading) {
    const selectedFont = fonts[font] || fonts["Inter"];
    return (
      <div
        className={cn(
          "h-full w-12 flex flex-col justify-between items-center",
          selectedFont.className
        )}
      >
        <div className="flex gap-4 flex-col">
          <Skeleton className="size-12 rounded-sm" />
          <div className="flex flex-col gap-2 items-center justify-center">
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="size-10 rounded-sm" />
        </div>
      </div>
    );
  }

  if (isWorkspacesError || isCurrentUserError) {
    return <div>Error...</div>;
  }

  const currentWorkspace = workspaces?.find(
    (workspace) => workspace.id === params.workspaceId
  );

  const currentUserData = {
    name: currentUser?.[0]?.name ?? "",
    image: currentUser?.[0]?.image ?? "",
  };
  const selectedFont = fonts[font] || fonts["Inter"];

  return (
    <div
      className={cn(
        "h-[calc(100vh-3rem)] w-12 min-w-12 flex flex-col justify-between items-center top-0 left-0",
        selectedFont.className
      )}
    >
      <PreferenceDialog />
      <AccountSettingDialog />
      <ConfirmSignOut />
      <div className="flex gap-y-4 flex-col items-center w-full">
        <Tooltip open={workspaceTooltipOpen}>
          <TooltipTrigger asChild>
            <div
              onClick={() => setWorkspaceTooltipOpen((prev) => !prev)}
              className="cursor-pointer"
            >
              {currentWorkspace ? (
                <WorkspaceAvatar
                  name={currentWorkspace.name}
                  image={currentWorkspace.image ?? ""}
                  className="size-10"
                />
              ) : (
                <WorkspaceAvatar
                  name="Logo"
                  image="/images/logo.png"
                  className="size-14"
                />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent
            className="rounded-sm border-r-2 border-b-2 border-t border-l p-0"
            side="bottom"
            align="start"
            ref={workspaceRef}
            onClick={(e) => e.stopPropagation()}
          >
            <WorkspaceSwitcher
              workspaces={workspaces}
              closeWorkspaceSwitcher={setWorkspaceTooltipOpen}
            />
          </TooltipContent>
        </Tooltip>
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="hover:bg-primary-foreground/15 p-2 rounded-md cursor-pointer">
            <House />
          </div>
          <p className="text-xs">Home</p>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <Tooltip open={dmsTooltipOpen}>
            <TooltipTrigger className="cursor-pointer" asChild>
              <div
                className="hover:bg-primary-foreground/15 p-2 rounded-md"
                onClick={() => setDmsTooltipOpen((prev) => !prev)}
              >
                <MessageCircleMore />
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="rounded-sm"
              side="right"
              align="start"
              ref={dmsRef}
              onClick={(e) => e.stopPropagation()}
            >
              <DirectMessage />
            </TooltipContent>
          </Tooltip>
          <p className="text-xs">DMs</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center justify-center">
        {currentWorkspace?.member?.role === "admin" && (
          <div>
            {isDesktop ? (
              <Dialog
                open={workspaceSettingDialogOpen}
                onOpenChange={(open) => {
                  if (open) {
                    setWorkspaceSettingDialogOpen(true);
                  } else {
                    setWorkspaceSettingDialogOpen(false);
                  }
                }}
              >
                <DialogTrigger asChild className="border-none">
                  <Button
                    className="flex items-center justify-center w-full rounded-none p-1 border-none bg-transparent hover:bg-transparent"
                    onClick={() => {
                      setWorkspaceSettingDialogOpen(true);
                    }}
                    variant="ghost"
                  >
                    <Settings />
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="w-full max-w-6xl
      "
                >
                  <DialogTitle className="hidden" />
                  <WorkspaceSettingComponent />
                </DialogContent>
              </Dialog>
            ) : (
              <Drawer
                open={workspaceSettingDialogOpen}
                onOpenChange={setWorkspaceSettingDialogOpen}
              >
                <DrawerTitle className="hidden" />
                <DrawerContent>
                  <div className="overflow-y-auto hide-scrollbar max-h-[85vh]"></div>
                </DrawerContent>
              </Drawer>
            )}
          </div>
        )}
        <Tooltip open={userProfileTooltipOpen}>
          <TooltipTrigger
            onClick={() => setUserProfileTooltipOpen((prev) => !prev)}
          >
            <MemberAvatar
              name={currentUser?.[0]?.name ?? ""}
              image={currentUser?.[0]?.image ?? ""}
              className="size-10 rounded-sm cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent
            className="rounded-sm"
            side="right"
            align="start"
            ref={profileRef}
            onClick={(e) => e.stopPropagation()}
          >
            <UserProfile
              user={currentUserData}
              setUserProfileTooltipOpen={setUserProfileTooltipOpen}
              confirm={confirm}
            />
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

const PreferenceDialog = () => {
  const { isOpen, openModal, closeModal } = usePreferenceModalStore();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          openModal();
        } else {
          closeModal();
        }
      }}
    >
      <DialogContent className="w-full max-w-4xl p-0 gap-0">
        <DialogHeader className="border-b-2">
          <DialogTitle>
            <p className="text-lg font-semibold py-2 px-4">Preferences</p>
          </DialogTitle>
        </DialogHeader>
        <Preferences />
      </DialogContent>
    </Dialog>
  );
};

const AccountSettingDialog = () => {
  const { isOpen, openModal, closeModal } = useAccountModalStore();
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          openModal();
        } else {
          closeModal();
        }
      }}
    >
      <DialogContent
        className="w-full max-w-4xl p-0 gap-0
      "
      >
        <DialogHeader className="border-b-2">
          <DialogTitle>
            <p className="text-lg font-semibold py-2 px-4">Account Settings</p>
          </DialogTitle>
        </DialogHeader>
        <AccountSetting />
      </DialogContent>
    </Dialog>
  );
};
