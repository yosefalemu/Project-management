import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createChannelSchema,
  createChannelSchemaType,
} from "@/features/channels/validators/create-channel";
import { getChannelSchemaType } from "@/features/channels/validators/get-channel";
import { Form } from "@/components/ui/form";
import CustomInputLabel from "@/components/inputs/custom-input-label";
import CustomTextareaLabel from "@/components/inputs/custom-textarea-label";
import { Button } from "@/components/ui/button";
import { useCreateProjectChannel } from "@/features/channels/api/create-project-channel";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetProjectMembers } from "@/features/projects/api/get-project-member-api";
import CustomSelectInput from "@/components/inputs/custom-select-input";
import { useChannelModalHook } from "../hooks/use-channel-modal";
import { toast } from "sonner";
import { useMedia } from "react-use";

interface ChannelFormProps {
  channel?: getChannelSchemaType;
}
export default function ChannelForm({ channel }: ChannelFormProps) {
  const params = useParams();
  const createChannelMutation = useCreateProjectChannel();
  const { close } = useChannelModalHook();
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const { data: membersFound, isLoading: isLoadingMembers } =
    useGetProjectMembers({
      projectId: params.projectId as string,
      workspaceId: params.workspaceId as string,
    });

  const memberOptions = membersFound?.map((member) => ({
    id: member.id || "",
    name: member.name || "",
  }));

  const createChannelForm = useForm({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: "",
      description: "",
      defaultReceiver: "",
    },
  });

  const handleCreateChannel = async (data: createChannelSchemaType) => {
    createChannelMutation.mutate(
      { json: data },
      {
        onSuccess: () => {
          createChannelForm.reset();
          close();
          toast.success("Channel created successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Something went wrong");
        },
      }
    );
  };
  console.log("create channel form value", createChannelForm.getValues());

  return (
    <div>
      {channel ? null : (
        <Form {...createChannelForm}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={createChannelForm.handleSubmit(handleCreateChannel)}
          >
            <h1 className="text-xl font-semibold">Update channel</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-y-2">
                <CustomInputLabel
                  fieldTitle="Channel Name"
                  nameInSchema="name"
                  placeHolder="Enter the channel name"
                  maxCharLength={50}
                />
                <CustomTextareaLabel
                  fieldTitle="Channel Description"
                  nameInSchema="description"
                  placeHolder="Enter the channel description"
                  maxCharLength={1000}
                />
              </div>
              <div className="flex flex-col gap-y-2">
                {memberOptions && (
                  <CustomSelectInput
                    fieldTitle="Default Receiver"
                    nameInSchema="defaultReceiver"
                    data={memberOptions}
                    isFetchingData={isLoadingMembers}
                    placeHolder="Select a default receiver"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-4">
              <Button
                type="button"
                variant="secondary"
                size={isDesktop ? "lg" : "sm"}
                onClick={() => close()}
              >
                Cancel
              </Button>
              <Button size={isDesktop ? "lg" : "sm"} variant="default">
                {createChannelMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin" />
                  </span>
                ) : (
                  <p>Create Channel</p>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
