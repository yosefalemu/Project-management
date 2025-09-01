import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface MemberAvatarProps {
  image?: string;
  name: string;
  className?: string;
}
export default function MemberAvatar({
  image,
  name,
  className,
}: MemberAvatarProps) {
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  const handleImageError = () => {
    setImageLoadError(true);
  };
  if (image) {
    return (
      <div
        className={cn(
          "size-8 relative rounded-full overflow-hidden",
          className
        )}
        key={name}
      >
        <Image
          src={image && !imageLoadError ? image : "/images/person.png"}
          alt={name}
          fill
          className="object-contain"
          onError={handleImageError}
        />
      </div>
    );
  }
  return (
    <Avatar
      className={cn(
        "size-12 transition border-neutral-300 rounded-full",
        className
      )}
      key={name}
    >
      <AvatarFallback
        className={cn(
          "text-white bg-gray-900 font-normal text-lg uppercase rounded-full flex items-center justify-center",
          className
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}
