import DootedSeparator from "@/components/dooted-separator";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";
import { useInviteMemberModalHook } from "@/features/projects/hooks/use-invite-member-modal";
import { useGetInviteMember } from "../api/get-invite-member";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import MemberAvatar from "@/features/members/components/member-avatar";
import { MoreVerticalIcon } from "lucide-react";

export default function InviteMemberForm() {
  const { projectId, workspaceId } = useParams();
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const form = useForm();
  const { close } = useInviteMemberModalHook();

  const resolvedProjectId = Array.isArray(projectId) ? projectId[0] : projectId;
  const resolvedWorkspaceId = Array.isArray(workspaceId)
    ? workspaceId[0]
    : workspaceId;
  const { data, error, isFetching } = useGetInviteMember({
    projectId: resolvedProjectId,
    workspaceId: resolvedWorkspaceId,
  });

  console.log("InviteMemberForm data", data);
  console.log("InviteMemberForm error", error);
  const handleInviteMember = () => {};
  return (
    <div>
      <Input placeholder="Search Member" className="h-12" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleInviteMember)}>
          <DootedSeparator className="py-4" />
          {isFetching ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-2 h-52 overflow-y-auto hide-scrollbar">
              {data?.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border px-2 py-3 rounded-md"
                >
                  <div className="flex items-center gap-x-2">
                    <Checkbox />
                    <MemberAvatar name={member.name} className="size-8" />
                    <p>{member.name}</p>
                  </div>
                  <div>
                    <MoreVerticalIcon />
                  </div>
                </div>
              ))}
            </div>
          )}
          <DootedSeparator className="py-4" />
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
            <Button type="submit" size={isDesktop ? "lg" : "sm"}>
              Invite Member
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
