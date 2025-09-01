"use client";
import MemberAvatar from "@/features/members/components/member-avatar";
import DootedSeparator from "../dooted-separator";
import { Button } from "../ui/button";
import { usePreferenceModalStore } from "@/states/modals/user-preference";
import { userProfileViewStore } from "@/states/user-profile";
import { useAccountModalStore } from "@/states/modals/account-setting";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type UserProfileProps = {
  user: {
    name: string;
    image?: string;
  };
  setUserProfileTooltipOpen: (userProfileTooltipOpen: boolean) => void;
  confirm: () => Promise<unknown>;
};
export default function UserProfile({
  user,
  setUserProfileTooltipOpen,
  confirm,
}: UserProfileProps) {
  const { name, image } = user;
  const router = useRouter();
  const { openModal: openPreferenceModal } = usePreferenceModalStore();
  const { openModal: openAccountModal } = useAccountModalStore();
  const { openUserProfile } = userProfileViewStore();

  const handleSignOut = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.push("/sign-in");
        },
        onError: ({ error, request, response }) => {
          console.error("Sign out error:", error, request, response);
          toast.error(error.message || "Failed to sign out");
        },
      },
    });
  };

  return (
    <div className="p-4 min-w-[250px] flex flex-col gap-2 items-start">
      <div className="flex gap-2">
        <MemberAvatar
          name={name}
          image={image ?? undefined}
          className="size-10 rounded-sm"
        />
        <div className="flex flex-col gap-0 justify-start items-start">
          <h1 className="font-semibold text-sm">{name}</h1>
          <p className="font-normal text-muted-foreground text-sm">
            status : Active
          </p>
        </div>
      </div>
      <DootedSeparator />
      <div className="flex flex-col gap-1 w-full">
        <Button
          className="flex justify-start w-full h-fit rounded-none p-1"
          onClick={() => {
            openUserProfile();
            setUserProfileTooltipOpen(false);
          }}
          variant="ghost"
        >
          Profile
        </Button>
        <Button
          className="flex justify-start w-full h-fit rounded-none p-1"
          onClick={() => {
            openPreferenceModal();
            setUserProfileTooltipOpen(false);
          }}
          variant="ghost"
        >
          Preferences
        </Button>
        <Button
          className="flex justify-start w-full h-fit rounded-none p-1"
          onClick={() => {
            openAccountModal();
            setUserProfileTooltipOpen(false);
          }}
          variant="ghost"
        >
          Account Settings
        </Button>
      </div>
      <DootedSeparator />
      <Button
        className="flex justify-start p-0 w-full h-fit rounded-sm py-2 px-1"
        variant="ghost"
        onClick={() => {
          setUserProfileTooltipOpen(false);
          handleSignOut();
        }}
      >
        Signout from {name}.jslack.com
      </Button>
    </div>
  );
}
