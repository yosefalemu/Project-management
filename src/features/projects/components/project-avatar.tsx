import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
}
export default function ProjectAvatar({
  image,
  name,
  className,
}: ProjectAvatarProps) {
  if (image) {
    return (
      <div
        className={cn("size-6 relative rounded-sm overflow-hidden", className)}
        key={name}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <Avatar className={cn("size-6 rounded-sm", className)} key={name}>
      <AvatarFallback className="text-white bg-blue-600 font-semibold text-sm uppercase rounded-md">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
}
