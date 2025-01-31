"use client";
import BackButton from "@/components/back-button";
import DootedSeparator from "@/components/dooted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/get-members-api";
import { useParams } from "next/navigation";
import { Fragment } from "react";
import MemberAvatar from "@/features/members/components/member-avatar";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
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

export default function MembersList() {
  const params = useParams();
  const { data, isPending, isError } = useGetMembers(
    params.workspaceId as string
  );

  return (
    <div className="w-full h-full flex flex-col">
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error...</div>
      ) : data ? (
        <Card className="w-full h-full flex flex-col border-none shadow-none">
          <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0 w-full">
            <BackButton />
            <CardTitle className="text-xl font-bold">Members List</CardTitle>
          </CardHeader>
          <DootedSeparator className="px-7" />
          <CardContent className="p-7 h-[610px] overflow-y-auto flex flex-col gap-y-2">
            {data?.map((member) => (
              <Fragment key={member.id}>
                <div className="flex items-center gap-2">
                  <MemberAvatar name={member.name!} key={member.id!} />
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
                        <MoreVerticalIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      side="bottom"
                      className="px-1"
                    >
                      <DropdownMenuItem
                        className="font-medium cursor-pointer"
                        onClick={() => {}}
                        disabled={false}
                      >
                        <GrUserAdmin className="mr-1" />
                        Set as Administrator
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium cursor-pointer"
                        onClick={() => {}}
                        disabled={false}
                      >
                        <RxPerson className="mr-1" />
                        Set as Member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium cursor-pointer"
                        onClick={() => {}}
                        disabled={false}
                      >
                        <LuView className="mr-1" />
                        Set as Viewer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium cursor-pointer"
                        onClick={() => {}}
                        disabled={false}
                      >
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
      ) : null}
    </div>
  );
}
