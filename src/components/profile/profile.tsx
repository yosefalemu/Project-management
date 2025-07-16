"use client";

import { userProfileViewStore } from "@/states/modals/user-profile";
import { Button } from "../ui/button";
import { useBetterAuthGetUser } from "@/features/auth/api/better-get-session";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import DootedSeparator from "../dooted-separator";
import { Mail, Phone } from "lucide-react";

export default function UserProfileInfo() {
  const { closeUserProfile } = userProfileViewStore();
  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
  } = useBetterAuthGetUser();
  if (isCurrentUserLoading) {
    return <div className="p-4">Loading...</div>;
  }
  if (isCurrentUserError || !currentUser) {
    return <div className="p-4">Error loading user profile</div>;
  }
  console.log("currentUser", currentUser);
  const { name, image } = currentUser[0];
  return (
    <div className="min-w-96 flex flex-col gap-4 border-l-2">
      <div className="flex items-center justify-between p-4 border-b-2">
        <h1>Profile</h1>
        <Button
          onClick={closeUserProfile}
          variant="ghost"
          size="icon"
          className="size-5"
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
            className="lucide lucide-x-icon lucide-x bg-transparent"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>
      <div className="flex flex-col gap-4 p-4 h-[545px] overflow-auto hide-scrollbar">
        <div className="flex items-center justify-center w-full min-h-72">
          <div className="w-5/6 h-full rounded-lg relative border-2">
            <Image
              src={image || "/images/default-profile.png"}
              alt={name}
              className="w-full h-full object-cover rounded-lg"
              fill
            />
            {!image && (
              <Button className="absolute top-2 right-2 py-1 text-sm h-fit">
                Upload Photo
              </Button>
            )}
          </div>
        </div>
        <DootedSeparator />
        <div className="flex items-center justify-between w-full">
          <h1>{name}</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-blue-600">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div>Edit form</div>
            </DialogContent>
          </Dialog>
        </div>
        <DootedSeparator />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1>Contact Information</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="text-blue-600">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Contact Information</DialogTitle>
                </DialogHeader>
                <div>Edit Contact Information</div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-primary">
              <Mail />
            </div>
            <div className="flex flex-col justify-between items-start">
              <h1 className="font-semibold text-sm">Email</h1>
              <p className="text-sm font-normal text-muted-foreground text-blue-600">
                {currentUser[0].email}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex h-10 w-10 p-2 items-center justify-center rounded-md border-2 border-primary">
              <Phone />
            </div>
            <div className="flex flex-col justify-between items-start">
              <h1 className="font-semibold text-sm">Phone</h1>
              <p className="text-sm font-normal text-muted-foreground text-blue-600">
                0952525503
              </p>
            </div>
          </div>
        </div>
        <DootedSeparator />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1>About Me</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="text-blue-600">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Start Date</DialogTitle>
                </DialogHeader>
                <div>Edit Start Date Form</div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col items-start gap-2">
            <h1 className="font-semibold text-sm">Start Date</h1>
            <p className="text-sm font-normal text-muted-foreground text-blue-600">
              {currentUser[0].email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
