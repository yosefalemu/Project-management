import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function UserButton() {
  return (
    <Link href="/settings/me">
      <Avatar className="size-[52px] border border-neutral-300">
        <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
          Y
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
