"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WorkspaceSwitcher from "../workspace-switcher";
import { useGetWorkspaces } from "@/features/workspace/api/get-workspaces-api";
import WorkspaceAvatar from "@/features/workspace/components/workspace-avatar";
import { Skeleton } from "../ui/skeleton";
import { useParams } from "next/navigation";
import DirectMessage from "../direct-message";
import { useBetterAuthGetUser } from "@/features/auth/api/better-get-user";
import MemberAvatar from "@/features/members/components/member-avatar";
import UserProfile from "./user-profile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Preferences from "./preferences/preferences";
import { usePreferenceModalStore } from "@/states/modals/user-preference";
import { useState, useRef, useEffect } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { useAccountModalStore } from "@/states/modals/account-setting";
import AccountSetting from "@/components/sidebars/account-settings/account-setting";

export default function RightSidebar() {
  const params = useParams();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const dmsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [workspaceTooltipOpen, setWorkspaceTooltipOpen] = useState(false);
  const [dmsTooltipOpen, setDmsTooltipOpen] = useState<boolean>(false);
  const [userProfileTooltipOpen, setUserProfileTooltipOpen] =
    useState<boolean>(false);

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
  } = useBetterAuthGetUser();
  const { data, isLoading, isError } = useGetWorkspaces();

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

  if (isLoading || isCurrentUserLoading) {
    return <Skeleton className="h-14 w-14" />;
  }

  if (isError || isCurrentUserError) {
    return <div>Error...</div>;
  }

  const currentWorkspace = data?.find(
    (workspace) => workspace.id === params.workspaceId
  );

  const currentUserData = {
    name: currentUser?.[0]?.name ?? "",
    image: currentUser?.[0]?.image ?? "",
  };

  return (
    <div className="h-full min-w-12 flex flex-col justify-between items-center">
      <PreferenceDialog />
      <AccountSettingDialog />
      <ConfirmSignOut />
      <div className="flex gap-4 flex-col">
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
            className="rounded-sm"
            side="bottom"
            align="start"
            ref={workspaceRef}
            onClick={(e) => e.stopPropagation()}
          >
            <WorkspaceSwitcher
              workspaces={data}
              closeWorkspaceSwitcher={setWorkspaceTooltipOpen}
            />
          </TooltipContent>
        </Tooltip>
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="hover:bg-primary-foreground/15 p-2 rounded-md cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-house-icon lucide-house"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-message-circle-more-icon lucide-message-circle-more"
                >
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  <path d="M8 12h.01" />
                  <path d="M12 12h.01" />
                  <path d="M16 12h.01" />
                </svg>
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
