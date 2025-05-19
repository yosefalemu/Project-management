import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberActionProps {
  id: string;
  role: string;
  children: React.ReactNode;
  handleChangeRole: (id: string, role: "admin" | "viewer" | "member") => void;
}

export default function InviteMemberAction({
  id,
  role,
  children,
  handleChangeRole,
}: MemberActionProps) {
  console.log("ROLE FOUND", role);
  return (
    <div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className={cn(
              "font-medium p-[10px] cursor-pointer !hover:bg-yellow-400",
              role === "member" && "bg-green-200"
            )}
            onClick={() => handleChangeRole(id, "member")}
          >
            <User className="size-4 mr-1 stroke-2" />
            <p>Member</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              "font-medium p-[10px] cursor-pointer !hover:bg-yellow-400",
              role === "viewer" && "bg-green-200"
            )}
            onClick={() => handleChangeRole(id, "viewer")}
          >
            <Eye className="size-4 mr-1 stroke-2" />
            <p>Viewer</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={cn(
              "font-medium p-[10px] cursor-pointer !hover:bg-yellow-400",
              role === "admin" && "bg-green-200"
            )}
            onClick={() => handleChangeRole(id, "admin")}
          >
            <ShieldCheck className="size-4 mr-1 stroke-2" />
            <p>Admin</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
