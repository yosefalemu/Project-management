import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  if (image) {
    return (
      <div
        className={cn(
          "size-8 relative rounded-full overflow-hidden",
          className
        )}
        key={name}
      >
        <Image src={image} alt={name} fill className="object-cover" />
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
          "text-neutral-500 bg-neutral-200 font-semibold text-lg uppercase rounded-full flex items-center justify-center",
          className
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}
