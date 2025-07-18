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
import { Mail, Phone } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import setCanvasPreview from "@/lib/setCanvasPreview";
import { useBetterAuthUpdateUser } from "@/features/auth/api/better-update-user";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;
const FIXED_IMAGE_WIDTH = 280;
const FIXED_IMAGE_HEIGHT = FIXED_IMAGE_WIDTH / ASPECT_RATIO;
const FIXED_CROP_HEIGHT_PERCENT = 70;

export default function UserProfileInfo() {
  const userProfileViewRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { closeUserProfile } = userProfileViewStore();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop | undefined>();
  const [error, setError] = useState<string | null>(null);

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
  } = useBetterAuthGetUser();

  const updateUserProfile = useBetterAuthUpdateUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: 100,
        height: FIXED_CROP_HEIGHT_PERCENT,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
    updatePreview(centeredCrop, e.currentTarget);
  };

  const updatePreview = (crop: Crop, img: HTMLImageElement) => {
    if (img && previewCanvasRef.current && crop) {
      setCanvasPreview(
        img,
        previewCanvasRef.current,
        convertToPixelCrop(crop, img.width, img.height)
      );
      const dataUrl = previewCanvasRef.current.toDataURL();
      setCroppedImageUrl(dataUrl);
    }
  };

  const handleCropChange = (_: PixelCrop, percentCrop: Crop) => {
    setCrop({
      unit: "%",
      x: 0,
      y: percentCrop.y,
      width: 100,
      height: FIXED_CROP_HEIGHT_PERCENT,
    });
    if (imgRef.current) {
      updatePreview(
        {
          unit: "%",
          x: 0,
          y: percentCrop.y,
          width: 100,
          height: FIXED_CROP_HEIGHT_PERCENT,
        },
        imgRef.current
      );
    }
  };

  const handleCloseDialog = () => {
    setPreviewImage(null);
    setCrop(undefined);
    setError(null);
    setCroppedImageUrl(null);
    if (previewCanvasRef.current) {
      previewCanvasRef.current
        .getContext("2d")
        ?.clearRect(
          0,
          0,
          previewCanvasRef.current.width,
          previewCanvasRef.current.height
        );
    }
    if (imgRef.current) {
      imgRef.current.src = "";
    }
    // Reset the file input
    if (userProfileViewRef.current) {
      userProfileViewRef.current.value = "";
    }
  };

  const handleSaveCroppedImage = () => {
    if (imgRef.current && previewCanvasRef.current && crop) {
      setCanvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
      );
      const dataUrl = previewCanvasRef.current.toDataURL();
      console.log("Cropped Image Data URL:", dataUrl);
      updateUserProfile.mutate(
        {
          json: {
            image: dataUrl,
          },
        },
        {
          onSuccess: () => {
            handleCloseDialog();
          },
          onError: (error) => {
            console.error("Error updating user profile:", error);
            setError("Failed to update profile image. Please try again.");
          },
        }
      );
    }
  };

  if (isCurrentUserLoading) {
    return <div className="p-4">Loading...</div>;
  }
  if (isCurrentUserError || !currentUser) {
    return <div className="p-4">Error loading user profile</div>;
  }

  const { name, image, email } = currentUser[0];

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="absolute top-2 right-2 py-1 text-sm h-fit">
                    Upload Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Profile Photo</DialogTitle>
                  </DialogHeader>
                  <div className="w-full relative h-96 mb-4 bg-primary-foreground">
                    {previewImage ? (
                      <div className="h-full w-full flex items-center justify-center overflow-hidden">
                        <ReactCrop
                          crop={crop}
                          onChange={handleCropChange}
                          aspect={ASPECT_RATIO}
                          minWidth={MIN_DIMENSION}
                          minHeight={MIN_DIMENSION / ASPECT_RATIO}
                          locked // Prevent resizing
                          style={{ overflow: "hidden" }}
                        >
                          <div className="relative w-full h-full">
                            <img
                              ref={imgRef}
                              src={previewImage}
                              alt="Preview"
                              className="object-cover rounded-none"
                              style={{ width: `${FIXED_IMAGE_WIDTH}px` }}
                              onLoad={onImageLoad}
                            />
                          </div>
                        </ReactCrop>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 items-center justify-center h-96 border-2 border-dashed rounded-lg">
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
                    )}
                    {error && (
                      <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1>Preview</h1>
                    <div className="relative w-24 h-24">
                      <Image
                        src={croppedImageUrl || "/images/default-profile.png"}
                        alt={name}
                        className="w-full h-full object-cover rounded-sm"
                        width={100}
                        height={100 / ASPECT_RATIO}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="h-10 px-8"
                        onClick={handleCloseDialog}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white h-10 px-8"
                      onClick={handleSaveCroppedImage}
                      disabled={
                        !previewImage || !crop || updateUserProfile.isPending
                      }
                    >
                      {updateUserProfile.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      display: "none",
                      border: "1px solid black",
                      objectFit: "contain",
                      width: 150,
                      height: 150 / ASPECT_RATIO,
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between w-full border-b-2 pb-4">
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
        <div className="flex flex-col gap-2 border-b-2 pb-4">
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
                0952525503
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Start Date</DialogTitle>
                </DialogHeader>
                <div>Edit Start Date Form</div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h1 className="font-semibold text-sm">Start Date</h1>
            <p className="text-sm font-normal underline text-blue-600">
              {email} {/* TODO: Replace with actual start date */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
