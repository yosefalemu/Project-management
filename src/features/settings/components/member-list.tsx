import DootedSeparator from "@/components/dooted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import MemberAvatar from "@/features/members/components/member-avatar";
import { cn } from "@/lib/utils";
import { MoreVerticalIcon } from "lucide-react";
import { Fragment } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { LuView } from "react-icons/lu";
import { RxPerson } from "react-icons/rx";
import { useConfirm } from "@/hooks/use-confirm";

export default function ProjectMemberList({
  data,
}: {
  data: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    userRole: "admin" | "viewer" | "member" | undefined;
  }[];
}) {
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the project",
    {
      variant: "destructive",
      confirmLabel: "Remove",
      cancelLabel: "Cancel",
    }
  );

  const handleRemoveMember = async (memberId: string) => {
    console.log("remove member", memberId);
    const ok = await confirm();
    if (!ok) return;
    //TODO EMPLEMENT REMOVE MEMBER
  };

  return (
    <div className="w-full h-full relative">
      <Card className="w-full h-full flex flex-col border-none shadow-none">
        <ConfirmDialog />
        <CardHeader>
          <CardTitle className="text-xl font-bold">Members List</CardTitle>
        </CardHeader>
        <DootedSeparator className="px-7" />
        {data.length > 0 ? (
          <CardContent className="p-7 h-[610px] overflow-y-auto flex flex-col gap-y-2">
            {data?.map((member) => (
              <Fragment key={member.id}>
                <div className="flex items-center gap-2">
                  <MemberAvatar
                    name={member.name!}
                    key={member.id!}
                    image={member.image ?? undefined}
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs font-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="ml-auto"
                      >
                        <MoreVerticalIcon className="size-4 text-muted-foreground cursor-pointer" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      side="bottom"
                      className="px-1"
                    >
                      <DropdownMenuItem
                        className={cn(
                          "font-medium cursor-pointer py-3",
                          `${
                            member.userRole === "admin" ? "bg-neutral-50" : ""
                          }`
                        )}
                      >
                        <span className="w-4">
                          {member.userRole === "admin" && (
                            <FaCheckCircle className="text-green-700" />
                          )}
                        </span>
                        <GrUserAdmin className="mr-1" />
                        Set as Administrator
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "font-medium cursor-pointer py-3",
                          `${
                            member.userRole === "member" ? "bg-neutral-50" : ""
                          }`
                        )}
                      >
                        <span className="w-4">
                          {member.userRole === "member" && (
                            <FaCheckCircle className="text-green-700" />
                          )}
                        </span>
                        <RxPerson className="mr-1" />
                        Set as Member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={cn(
                          "font-medium cursor-pointer py-3",
                          `${
                            member.userRole === "viewer" ? "bg-neutral-50" : ""
                          }`
                        )}
                        disabled={false}
                      >
                        <span className="w-4">
                          {member.userRole === "viewer" && (
                            <FaCheckCircle className="text-green-700" />
                          )}
                        </span>
                        <LuView className="mr-1" />
                        Set as Viewer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <span className="w-4" />
                        <IoPersonRemoveOutline className="mr-1" />
                        <span className="text-amber-700">
                          Remove {member.name}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {data.indexOf(member) !== data.length - 1 && (
                  <Separator className="my-2.5" />
                )}
              </Fragment>
            ))}
          </CardContent>
        ) : (
          <CardContent className="h-full flex items-center justify-center"></CardContent>
        )}
      </Card>
    </div>
  );
}
