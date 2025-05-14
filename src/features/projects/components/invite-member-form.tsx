import DootedSeparator from "@/components/dooted-separator";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";
import { useInviteMemberModalHook } from "@/features/projects/hooks/use-invite-member-modal";

export default function InviteMemberForm() {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const form = useForm();
  const { close } = useInviteMemberModalHook();
  const handleInviteMember = () => {};
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleInviteMember)}>
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
              Invite
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
