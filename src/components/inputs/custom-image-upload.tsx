import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ImageIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { FormField, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";

interface CustomImageUploaderProps {
  fieldTitle: string;
  nameInSchema: string;
  className?: string;
}

export default function CustomImageUploader({
  fieldTitle,
  nameInSchema,
  className,
}: CustomImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useFormContext();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const initialValue = form.getValues(nameInSchema);
    if (typeof initialValue === "string" && initialValue) {
      setImagePreview(initialValue);
    }
  }, [form, nameInSchema]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    form.clearErrors(nameInSchema);
    const maxSizeInBytes = 1 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      form.setError(nameInSchema, {
        type: "manual",
        message: "File size exceeds 1MB limit",
      });
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      form.setError(nameInSchema, {
        type: "manual",
        message: "Invalid file type. Only JPG, PNG, and SVG are allowed.",
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      form.setValue(nameInSchema, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    form.setValue(nameInSchema, "", {
      shouldDirty: true,
    });
    setImagePreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={() => (
        <div className={cn("flex flex-col gap-y-2", className)}>
          <div className="flex items-center gap-x-5">
            {imagePreview ? (
              <div className="size-[72px] rounded-md overflow-hidden relative">
                <Image
                  src={imagePreview}
                  fill
                  className="object-cover"
                  alt="Logo"
                />
              </div>
            ) : (
              <Avatar className="size-[72px]">
                <AvatarFallback>
                  <ImageIcon className="text-[32px] text-neutral-400" />
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col">
              <p className="text-sm">{fieldTitle}</p>
              <p className="text-sm text-muted-foreground">
                JPG, PNG, SVG, JPEG, max 1mb
              </p>
              <input
                type="file"
                className="hidden"
                ref={inputRef}
                onChange={handleImageChange}
                accept=".jpg,.png,.jpeg,.svg"
              />
              {imagePreview ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-fit mt-2"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-fit mt-2"
                  onClick={() => inputRef.current?.click()}
                >
                  Upload Image
                </Button>
              )}
            </div>
          </div>
          <FormMessage />
        </div>
      )}
    />
  );
}
