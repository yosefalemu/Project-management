"use client";

import { userProfileViewStore } from "@/states/modals/user-profile";
import { Button } from "../ui/button";

export default function UserProfileInfo() {
  const { closeUserProfile } = userProfileViewStore();
  return (
    <div className="min-w-96 flex justify-between">
      UserProfile Information
      <Button
        onClick={closeUserProfile}
        variant="outline"
        size="icon"
        className="bg-transparent hover:bg-transparent"
      >
        Close
      </Button>
    </div>
  );
}
