import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";
import { useInviteMemberModalHook } from "@/features/projects/hooks/use-invite-member-modal";
import { useGetAddMember } from "@/features/projects/api/get-add-member";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import MemberAvatar from "@/features/members/components/member-avatar";
import { MoreVerticalIcon, Loader2 } from "lucide-react";
import InviteMemberAction from "./add-member-action";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { addMemberType, addMemberValidator } from "../validators/add-member";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddProjectMember } from "../api/add-member-api";
import { toast } from "sonner";
import Empty from "@/components/empty";

export default function InviteMemberForm() {
  const { projectId, workspaceId } = useParams();
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const { close } = useInviteMemberModalHook();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<
    { id: string; email: string; name: string; image: string }[]
  >([]);
  const [selectedMembers, setSelectedMembers] = useState<
    { userRole: "admin" | "member" | "viewer"; userId: string }[]
  >([]);

  const resolvedProjectId = Array.isArray(projectId) ? projectId[0] : projectId;
  const resolvedWorkspaceId = Array.isArray(workspaceId)
    ? workspaceId[0]
    : workspaceId;

  const { data, error, isLoading } = useGetAddMember({
    projectId: resolvedProjectId,
    workspaceId: resolvedWorkspaceId,
  });

  useEffect(() => {
    setFilteredMembers(
      data
        ?.filter((member) =>
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((member) => ({
          ...member,
          image: member.image ?? "",
        })) || []
    );
  }, [searchTerm, data]);

  const dataToDisplay = searchTerm ? filteredMembers : data;

  const handleCheckboxChange = (
    userId: string,
    checked: boolean,
    userRole: "admin" | "viewer" | "member"
  ) => {
    setSelectedMembers((prev) =>
      checked
        ? [...prev, { userId, userRole }]
        : prev.filter((member) => member.userId !== userId)
    );
  };

  const handleChangeRole = (
    userId: string,
    userRole: "admin" | "viewer" | "member"
  ) => {
    setSelectedMembers((prev) =>
      prev.map((member) =>
        member.userId === userId ? { ...member, userRole } : member
      )
    );
  };

  const form = useForm<addMemberType>({
    resolver: zodResolver(addMemberValidator),
    defaultValues: {
      projectId: resolvedProjectId ?? "",
      workspaceId: resolvedWorkspaceId ?? "",
      addMembers: [],
    },
  });

  const { mutate, isPending } = useAddProjectMember();

  const handleInviteMember = (formData: addMemberType) => {
    mutate(
      {
        json: {
          projectId: formData.projectId,
          workspaceId: formData.workspaceId,
          addMembers: formData.addMembers,
        },
      },
      {
        onSuccess: () => {
          toast.success("Members added successfully", {
            description: "You can now see the members in the project",
          });
          form.reset();
          setSelectedMembers([]);
        },
        onError: () => {
          toast.error(
            "An error occurred while adding members. Please try again."
          );
        },
      }
    );
  };

  useEffect(() => {
    form.setValue("addMembers", selectedMembers, { shouldValidate: true });
  }, [form, selectedMembers]);

  return (
    <div className="p-2">
      <Input
        placeholder="Search Member by email"
        className="h-12 mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading ? (
        <div className="space-y-2 h-52">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index}>
              <div className="flex items-center justify-between border px-2 py-3 rounded-md">
                <div className="flex items-center gap-x-2">
                  <Skeleton className="h-5 w-5 rounded-sm" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
                <div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </Skeleton>
          ))}
        </div>
      ) : error ? (
        <div>Error</div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleInviteMember)}>
            <div className="space-y-2 h-52 overflow-y-auto hide-scrollbar">
              {(dataToDisplay ?? []).length > 0 ? (
                <>
                  {(dataToDisplay ?? []).map((member, index) => {
                    const selectedMember = selectedMembers.find(
                      (m) => m.userId === member.id
                    );
                    const currentRole = selectedMember?.userRole ?? "member";
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between border px-2 py-3 rounded-md"
                      >
                        <div className="flex items-center gap-x-4">
                          <Checkbox
                            checked={selectedMembers.some(
                              (m) => m.userId === member.id
                            )}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                member.id,
                                checked as boolean,
                                currentRole
                              )
                            }
                          />
                          <MemberAvatar
                            name={member.name}
                            className="size-8"
                            image={member.image ?? undefined}
                          />
                          <div>
                            <p className="text-sm">{member.name}</p>
                            <p className="opacity-50 text-xs">{member.email}</p>
                          </div>
                        </div>
                        <div>
                          <InviteMemberAction
                            id={member.id}
                            role={currentRole}
                            handleChangeRole={handleChangeRole}
                          >
                            <Button variant="ghost" className="size-8 p-0">
                              <MoreVerticalIcon />
                            </Button>
                          </InviteMemberAction>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-col space-y-4">
                  <Empty
                    title="No Members Found"
                    description="Try searching with different keywords or invite new members."
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-x-2">
              <Button
                type="button"
                size={isDesktop ? "lg" : "sm"}
                variant="secondary"
                onClick={() => {
                  form.reset();
                  close();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size={isDesktop ? "lg" : "sm"}
                disabled={isPending || selectedMembers.length === 0}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Add Members"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
