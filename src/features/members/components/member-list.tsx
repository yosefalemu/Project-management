"use client";
import DootedSeparator from "@/components/dooted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/get-members-api";
import { useParams } from "next/navigation";
import { Fragment } from "react";
import MemberAvatar from "@/features/members/components/member-avatar";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GrUserAdmin } from "react-icons/gr";
import { RxPerson } from "react-icons/rx";
import { LuView } from "react-icons/lu";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { useConfirm } from "@/hooks/use-confirm";
import { useUpdateMember } from "@/features/members/api/update-member-api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loading-slice";

export default function MembersList() {
  const params = useParams();
  const dispatch = useDispatch();
  const { mutate: updateMemberMutate, isPending: updateMemberIsPending } =
    useUpdateMember();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace",
    {
      variant: "destructive",
      confirmLabel: "Remove",
      cancelLabel: "Cancel",
    }
  );
  const { data, isPending, isError } = useGetMembers(
    params.workspaceId as string
  );

  const handleUpdateRole = async (
    memberId: string,
    role: "member" | "admin" | "viewer"
  ) => {
    dispatch(setLoading(true));
    updateMemberMutate(
      {
        memberId,
        workspaceId: params.workspaceId as string,
        role,
      },
      {
        onSuccess: () => {
          toast.success("Member role updated successfully");
          dispatch(setLoading(false));
        },
        onError: (error) => {
          toast.error(error.message);
          dispatch(setLoading(false));
        },
      }
    );
  };
  const handleRemoveMember = async (memberId: string) => {
    console.log("remove member", memberId);
    const ok = await confirm();
    if (!ok) return;
    //TODO EMPLEMENT REMOVE MEMBER
  };

  return (
    <div className="w-full h-full flex flex-col">
      {isPending ? (
        <div className="relative">
          <div>Loading...</div>
        </div>
      ) : isError ? (
        <div>Error...</div>
      ) : data ? (
        <div className="w-full h-full relative">
          <Card className="w-full h-full flex flex-col border-none shadow-none">
            <ConfirmDialog />
            <CardHeader>
              <CardTitle className="text-xl font-bold">Members List</CardTitle>
            </CardHeader>
            <DootedSeparator className="px-7" />
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
                          onClick={() => {
                            handleUpdateRole(member.id!, "admin");
                          }}
                          disabled={updateMemberIsPending}
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
                              member.userRole === "member"
                                ? "bg-neutral-50"
                                : ""
                            }`
                          )}
                          onClick={() => {
                            handleUpdateRole(member.id!, "member");
                          }}
                          disabled={updateMemberIsPending}
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
                              member.userRole === "viewer"
                                ? "bg-neutral-50"
                                : ""
                            }`
                          )}
                          onClick={() => {
                            handleUpdateRole(member.id!, "viewer");
                          }}
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
                          className="font-medium cursor-pointer py-3"
                          onClick={() => {
                            handleRemoveMember(member.id!);
                          }}
                          disabled={updateMemberIsPending}
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
          </Card>
        </div>
      ) : null}
    </div>
  );
}
