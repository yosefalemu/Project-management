import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ImageIcon } from "lucide-react";
import { useRef } from "react";
import { Button } from "../ui/button";
import { FormField } from "../ui/form";

interface CustomImageUploaderProps {
  fieldTitle: string;
  nameInSchema: string;
  isPending?: boolean;
}
export default function CustomImageUploader({
  fieldTitle,
  nameInSchema,
  isPending,
}: CustomImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useFormContext();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      form.setValue("image", file);
    }
  };
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => {
        return (
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-5">
              {field.value ? (
                <div className="size-[72px] rounded-md overflow-hidden relative">
                  <Image
                    src={
                      field.value instanceof File
                        ? URL.createObjectURL(field.value)
                        : field.value
                    }
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
                  disabled={isPending}
                  onChange={handleImageChange}
                  accept=".jpg, .png, .jpeg, .svg"
                />
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isPending}
                  size="sm"
                  className="w-fit mt-2"
                  onClick={() => inputRef.current?.click()}
                >
                  Upload Image
                </Button>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
