/* eslint-disable @next/next/no-img-element */
"use client";

import { userProfileViewStore } from "@/states/modals/user-profile";
import { Button } from "../../../components/ui/button";
import { useBetterAuthGetUser } from "@/features/auth/api/better-get-user";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Mail, Phone } from "lucide-react";
import React, { useRef, useState } from "react";
import { Input } from "../../../components/ui/input";
import EditProfile from "./edit-profile";
import CropImageComponent from "./crop-image";
import { FileUploader } from "react-drag-drop-files";
import "react-image-crop/dist/ReactCrop.css";
import EditContactInformation from "./edit-contact";
import EditStartDate from "./edit-startdate";
import { useGetStartDate } from "@/features/auth/api/get-start-date";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const MIN_DIMENSION = 150;
export default function UserProfileInfo() {
  const params = useParams();
  const userProfileViewRef = useRef<HTMLInputElement>(null);
  const workspaceId = params.workspaceId as string;

  const { closeUserProfile } = userProfileViewStore();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [openProfileImageUpload, setOpenProfileImageUpload] =
    useState<boolean>(false);
  const [userProfileView, setUserProfileView] = useState<boolean>(false);
  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
  } = useBetterAuthGetUser();

  const { data: startDate, isLoading: isStartDateLoading } =
    useGetStartDate(workspaceId);

  const handleFileChange = (
    input: File | React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = input instanceof File ? input : input.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new window.Image() as HTMLImageElement;
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e: Event) => {
        if (error) setError(null);
        const { naturalWidth, naturalHeight } =
          e.currentTarget as HTMLImageElement;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError(
            `Image dimensions must be at least ${MIN_DIMENSION}x${MIN_DIMENSION}px.`
          );
          return setPreviewImage(null);
        }
        setPreviewImage(imageUrl);
      });
    });
    reader.readAsDataURL(file);
  };

  if (isCurrentUserLoading || isStartDateLoading) {
    return (
      <div className="min-w-96 flex flex-col gap-4 border-l-2">
        <div className="flex items-center justify-between p-4 border-b-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-4 p-4 h-[545px] overflow-auto hide-scrollbar">
          <div className="flex items-center justify-center w-full min-h-72">
            <Skeleton className="w-5/6 h-72 rounded-lg" />
          </div>
          <div className="flex items-center justify-between w-full border-b-2 pb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex flex-col gap-2 border-b-2 pb-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex items-start gap-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isCurrentUserError || !currentUser) {
    return <div className="p-4">Error loading user profile</div>;
  }

  const { name, image, email, phoneNumber } = currentUser[0];
  const fileTypes = ["JPG", "PNG", "GIF"];

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
              <Dialog
                open={openProfileImageUpload}
                onOpenChange={setOpenProfileImageUpload}
              >
                <DialogTrigger asChild>
                  <Button className="absolute top-2 right-2 py-1 text-sm h-fit">
                    Upload Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  {previewImage ? (
                    <CropImageComponent
                      name={name}
                      uploadedImage={previewImage}
                      setPreviewImage={setPreviewImage}
                      setOpenProfileImageUpload={setOpenProfileImageUpload}
                    />
                  ) : (
                    <div className="flex flex-col gap-4">
                      <DialogHeader>
                        <DialogTitle>Add a profile photo</DialogTitle>
                      </DialogHeader>
                      <div className="w-full relative h-96 mb-4 bg-primary-foreground">
                        <div className="flex flex-col gap-4 items-center justify-center h-96 border-2 border-dashed rounded-lg">
                          <FileUploader
                            handleChange={handleFileChange}
                            name="file"
                            types={fileTypes}
                          >
                            <div className="flex flex-col items-center justify-center border-2 border-dashed p-4 rounded-lg">
                              <div className="relative w-48 h-48 mb-4">
                                <Image
                                  src="/images/uploade-image.png"
                                  fill
                                  alt="Upload Image"
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <p className="text-lg text-muted-foreground">
                                Drag and drop your image here
                              </p>
                            </div>
                          </FileUploader>
                          <Input
                            type="file"
                            accept="image/*"
                            ref={userProfileViewRef}
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button
                            onClick={() => userProfileViewRef.current?.click()}
                            variant="outline"
                            className="h-10 px-8"
                          >
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between w-full border-b-2 pb-4">
          <h1>{name}</h1>
          <Dialog open={userProfileView} onOpenChange={setUserProfileView}>
            <DialogTrigger asChild>
              <Button variant="link" className="text-blue-600">
                Edit
              </Button>
            </DialogTrigger>
            <EditProfile
              user={currentUser[0]}
              setUserProfileView={setUserProfileView}
              userProfileView={userProfileView}
            />
          </Dialog>
        </div>
        <div className="flex flex-col gap-2 border-b-2 pb-4">
          <div className="flex items-center justify-between">
            <h1>Contact Information</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="text-blue-600">
                  Edit
                </Button>
              </DialogTrigger>
              <EditContactInformation user={currentUser[0]} />
            </Dialog>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-primary">
              <Mail />
            </div>
            <div className="flex flex-col justify-between items-start">
              <h1 className="font-semibold text-sm">Email</h1>
              <p className="text-sm font-normal underline text-blue-600">
                {email}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex h-10 w-10 p-2 items-center justify-center rounded-md border-2 border-primary">
              <Phone />
            </div>
            <div className="flex flex-col justify-between items-start">
              <h1 className="font-semibold text-sm">Phone</h1>
              <p className="text-sm font-normal underline text-blue-600">
                {phoneNumber || "Not provided"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1>About Me</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="text-blue-600">
                  Edit
                </Button>
              </DialogTrigger>
              <EditStartDate startDatePrev={startDate?.startDate ?? null} />
            </Dialog>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h1 className="font-semibold text-sm">Start Date</h1>
            <div className="text-sm font-normal text-blue-600">
              {startDate ? (
                <div className="flex items-center gap-x-1">
                  <p>
                    {new Date(startDate.startDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    (
                    {formatDistanceToNow(new Date(startDate.startDate), {
                      addSuffix: true,
                    })}
                    )
                  </p>
                </div>
              ) : (
                <p>No start date provided</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
