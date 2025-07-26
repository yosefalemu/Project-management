import { useForm } from "react-hook-form";
import { useRef } from "react";
import CustomInputLabel from "../../../components/inputs/custom-input-label";
import { Form } from "../../../components/ui/form";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import { useBetterAuthUpdateUser } from "@/features/auth/api/better-update-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, updateUserType } from "@/zod-schemas/users-schema";
import { DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import CropImageComponent from "./crop-image";
import { cn } from "@/lib/utils";

type EditProfileProps = {
  user: {
    id: string;
    name: string;
    email: string;
    password: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
  };
  setUserProfileView: (value: boolean) => void;
  userProfileView: boolean;
};
export default function EditProfile({
  user,
  setUserProfileView,
  userProfileView,
}: EditProfileProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const updateUserProfile = useBetterAuthUpdateUser();
  const { id, name, email, password, emailVerified, image } = user;
  const [imagePreviewInEditProfile, setImagePreviewInEditProfile] = useState<
    string | null
  >(image || null);
  const [newImagePreview, setNewImagePreview] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImagePreviewInEditProfile(reader.result);
        setNewImagePreview(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const form = useForm<updateUserType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id,
      name,
      email,
      password,
      emailVerified,
      image,
    },
  });

  const handleSubmit = (data: updateUserType) => {
    updateUserProfile.mutate(
      {
        json: {
          ...data,
          image: imagePreviewInEditProfile || null,
        },
      },
      {
        onSuccess: () => {
          setUserProfileView(false);
        },
      }
    );
  };

  return (
    <DialogContent className={cn(!newImagePreview ? "max-w-2xl" : "max-w-md")}>
      {!newImagePreview ? (
        <div>
          <DialogHeader className="border-b-2 pb-2">
            <DialogTitle>
              {userProfileView ? "Edit Profile" : " Update Profile picture"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="flex flex-col gap-2 max-h-[450px] overflow-y-auto hide-scrollbar">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex flex-col gap-1 flex-1">
                    <CustomInputLabel
                      fieldTitle="Full Name"
                      nameInSchema="name"
                      placeHolder="Enter your full name"
                      className=""
                    />
                    <CustomInputLabel
                      fieldTitle="Email"
                      nameInSchema="email"
                      placeHolder="Enter your email"
                      className=""
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="">Profile Photo</h1>
                    <div className="flex flex-col gap-1">
                      <div className="relative w-48 h-48 rounded-sm overflow-hidden">
                        <Image
                          src={
                            imagePreviewInEditProfile ||
                            "/images/default-profile.png"
                          }
                          alt={name}
                          className="w-full h-full object-cover rounded-sm"
                          fill
                        />
                      </div>
                      <input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        ref={imageInputRef}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          imageInputRef.current?.click();
                        }}
                      >
                        Upload Photo
                      </Button>
                      {image && (
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => {
                            setImagePreviewInEditProfile(null);
                          }}
                        >
                          Remove Photo
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 border-t-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUserProfileView(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateUserProfile.isPending}>
                  {updateUserProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <CropImageComponent
          uploadedImage={imagePreviewInEditProfile || ""}
          name={name}
          setNewImagePreview={setNewImagePreview}
          setImagePreviewInEditProfile={setImagePreviewInEditProfile}
        />
      )}
    </DialogContent>
  );
}
