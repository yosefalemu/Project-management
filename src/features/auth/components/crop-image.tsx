/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import setCanvasPreview from "@/lib/setCanvasPreview";
import { DialogClose, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { useBetterAuthUpdateUser } from "@/features/auth/api/better-update-user";
import { toast } from "sonner";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;
const FIXED_IMAGE_WIDTH = 280;
const FIXED_CROP_HEIGHT_PERCENT = 70;

type CropImageComponentProps = {
  uploadedImage: string;
  name: string;
  setPreviewImage?: (image: string | null) => void;
  setOpenProfileImageUpload?: (open: boolean) => void;
  setNewImagePreview?: (value: boolean) => void;
  setImagePreviewInEditProfile?: (image: string | null) => void;
};
export default function CropImageComponent({
  uploadedImage,
  name,
  setPreviewImage,
  setOpenProfileImageUpload,
  setNewImagePreview,
  setImagePreviewInEditProfile,
}: CropImageComponentProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop | undefined>();
  const [error, setError] = useState<string | null>(null);
  const updateUserProfile = useBetterAuthUpdateUser();

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

  const handleCloseDialog = () => {
    if (setPreviewImage) {
      setPreviewImage(null);
    }
    setCrop(undefined);
    setError(null);
    setCroppedImageUrl(null);
    if (setOpenProfileImageUpload) {
      setOpenProfileImageUpload(false);
    }
    if (setNewImagePreview) {
      setNewImagePreview(false);
    }
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
  };

  const handleSaveCroppedImage = () => {
    if (imgRef.current && previewCanvasRef.current && crop) {
      setCanvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
      );
      const dataUrl = previewCanvasRef.current.toDataURL();
      if (setImagePreviewInEditProfile) {
        setImagePreviewInEditProfile(dataUrl);
      }
      updateUserProfile.mutate(
        {
          json: {
            image: dataUrl,
          },
        },
        {
          onSuccess: () => {
            handleCloseDialog();
            toast(
              "Profile image updated successfully. Please refresh the page to see the changes."
            );
          },
          onError: (error) => {
            console.error("Error updating user profile:", error);
            setError("Failed to update profile image. Please try again.");
          },
        }
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle>Add a profile photo</DialogTitle>
      </DialogHeader>
      <div className="w-full relative h-96 mb-4 bg-primary-foreground">
        <div className="h-full w-full flex items-center justify-center overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={handleCropChange}
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
            minHeight={MIN_DIMENSION / ASPECT_RATIO}
            locked
            style={{ overflow: "hidden" }}
          >
            <img
              ref={imgRef}
              src={uploadedImage || "/images/default-profile.png"}
              alt="Preview"
              className="object-cover rounded-none"
              style={{ width: `${FIXED_IMAGE_WIDTH}px` }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
          disabled={!uploadedImage || !crop || updateUserProfile.isPending}
        >
          {updateUserProfile.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
