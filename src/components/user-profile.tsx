import MemberAvatar from "@/features/members/components/member-avatar";
import DootedSeparator from "./dooted-separator";
import { Button } from "./ui/button";
import { usePreferenceModalStore } from "@/states/modals/user-preference";
import { userProfileViewStore } from "@/states/modals/user-profile";

type UserProfileProps = {
  user: {
    name: string;
    image?: string;
  };
  setUserProfileTooltipOpen: (userProfileTooltipOpen: boolean) => void;
};
export default function UserProfile({
  user,
  setUserProfileTooltipOpen,
}: UserProfileProps) {
  const { name, image } = user;
  const { openModal } = usePreferenceModalStore();
  const { openUserProfile } = userProfileViewStore();

  return (
    <div className="p-4 min-w-[250px] flex flex-col gap-2 items-start">
      <div className="flex gap-2">
        <MemberAvatar
          name={name}
          image={image ?? ""}
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
          className="flex justify-start w-full hover:bg-primary-foreground/15 h-fit rounded-none p-1"
          onClick={() => {
            openUserProfile();
            setUserProfileTooltipOpen(false);
          }}
        >
          Profile
        </Button>
        <Button
          className="flex justify-start w-full hover:bg-primary-foreground/15 h-fit rounded-none p-1"
          onClick={() => {
            openModal();
            setUserProfileTooltipOpen(false);
          }}
        >
          Preferences
        </Button>
      </div>
      <DootedSeparator />
      <Button className="flex justify-start p-0 w-full hover:bg-primary-foreground/15 h-fit rounded-sm py-2 px-1">
        Signout from {name}.jslack.com
      </Button>
    </div>
  );
}
