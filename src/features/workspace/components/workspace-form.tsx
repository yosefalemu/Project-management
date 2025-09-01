"use client";
import CustomInputLabel from "@/components/inputs/custom-input-label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  createWorkspaceSchema,
  createWorkspaceSchemaType,
} from "@/features/workspace/validators/create-workspace";
import { getWorkspaceSchemaType } from "@/features/workspace/validators/get-workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import CustomImageUploader from "@/components/inputs/custom-image-upload";
import CustomTextareaLabel from "@/components/inputs/custom-textarea-label";
import { useCreateWorkspace } from "@/features/workspace/api/create-workspace-api";
import { useUpdateWorkspace } from "@/features/workspace/api/update-workspace-api";
import DangerZone from "@/features/workspace/components/danger-zone";
import { useMedia } from "react-use";
import InviteCode from "@/features/workspace/components/invite-code";
import { useWorkspaceModalHook } from "@/features/workspace/hooks/use-workspace-modal";
import {
  updateWorkspaceSchema,
  updateWorkspaceSchemaType,
} from "@/features/workspace/validators/update-workspace";

interface WorkSpaceFormProps {
  workspace?: getWorkspaceSchemaType;
  setWorkspaceSettingDialogOpen?: (isOpen: boolean) => void;
}
export default function WorkSpaceForm({
  workspace,
  setWorkspaceSettingDialogOpen,
}: WorkSpaceFormProps) {
  const { close } = useWorkspaceModalHook();
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const createWorkspaceMutation = useCreateWorkspace();
  const updateWorkspaceMutation = useUpdateWorkspace();

  const createWorkspaceForm = useForm<createWorkspaceSchemaType>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: workspace?.name ?? "",
      image: workspace?.image ?? "",
      description: workspace?.description ?? "",
    },
  });

  const updateWorkspaceForm = useForm<updateWorkspaceSchemaType>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      id: workspace?.id ?? "",
      name: workspace?.name ?? "",
      image: workspace?.image ?? "",
      description: workspace?.description ?? "",
    },
  });

  const handleCreateWorkspace = (values: createWorkspaceSchemaType) => {
    createWorkspaceMutation.mutate({ json: values });
  };

  const handleUpdateWorkspace = (values: updateWorkspaceSchemaType) => {
    updateWorkspaceMutation.mutate({ json: values });
  };

  return (
    <div className="flex flex-col p-4 lg:p-6 w-full">
      <div>{workspace ? "Edit Workspace" : "Create Workspace"}</div>
      <div className="pt-4">
        {workspace ? (
          <Form {...updateWorkspaceForm}>
            <form
              onSubmit={updateWorkspaceForm.handleSubmit(handleUpdateWorkspace)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-4 w-full">
                  <CustomInputLabel
                    fieldTitle="Workspace Name"
                    nameInSchema="name"
                    placeHolder="Enter workspace name"
                    className=""
                    maxCharLength={50}
                  />
                  <CustomTextareaLabel
                    fieldTitle="Workspace Description"
                    nameInSchema="description"
                    placeHolder="Enter workspace description"
                    maxCharLength={500}
                    rows={8}
                    className=""
                  />
                  <CustomImageUploader
                    fieldTitle="Image"
                    nameInSchema="image"
                    className=""
                  />
                </div>
                <div className="flex flex-col gap-y-4 w-full">Column Two</div>
              </div>
              <div className="flex items-center justify-end gap-x-4">
                {updateWorkspaceForm.formState.isDirty ? (
                  <Button
                    type="button"
                    size={isDesktop ? "lg" : "sm"}
                    variant="secondary"
                    onClick={() => {
                      updateWorkspaceForm.reset();
                    }}
                    disabled={updateWorkspaceMutation.isPending}
                  >
                    Reset
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size={isDesktop ? "lg" : "sm"}
                    variant="secondary"
                    onClick={() => {
                      setWorkspaceSettingDialogOpen?.(false);
                    }}
                    disabled={updateWorkspaceMutation.isPending}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  size={isDesktop ? "lg" : "sm"}
                  className=""
                  disabled={
                    updateWorkspaceMutation.isPending ||
                    !updateWorkspaceForm.formState.isDirty
                  }
                >
                  {updateWorkspaceMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin" />
                    </span>
                  ) : (
                    <p>Save Changes</p>
                  )}
                </Button>
              </div>
              <div className="flex flex-col gap-y-4 mt-6">
                <InviteCode
                  workspaceId={workspace.id!}
                  inviteCode={workspace.inviteCode!}
                  inviteCodeExpire={workspace.inviteCodeExpire!}
                />
                <DangerZone workspaceId={workspace.id!} />
              </div>
            </form>
          </Form>
        ) : (
          <Form {...createWorkspaceForm}>
            <form
              onSubmit={createWorkspaceForm.handleSubmit(handleCreateWorkspace)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-y-4 w-full">
                  <CustomInputLabel
                    fieldTitle="Workspace Name"
                    nameInSchema="name"
                    placeHolder="Enter workspace name"
                    className=""
                    maxCharLength={50}
                  />
                  <CustomTextareaLabel
                    fieldTitle="Workspace Description"
                    nameInSchema="description"
                    placeHolder="Enter workspace description"
                    maxCharLength={500}
                    rows={8}
                    className=""
                  />
                  <CustomImageUploader
                    fieldTitle="Image"
                    nameInSchema="image"
                    className=""
                  />
                </div>
                <div className="flex flex-col gap-y-4 w-full">Column Two</div>
              </div>
              <div className="flex items-center justify-end gap-x-4">
                <Button
                  type="button"
                  size={isDesktop ? "lg" : "sm"}
                  variant="secondary"
                  onClick={() => {
                    createWorkspaceForm.reset();
                    close();
                  }}
                  disabled={createWorkspaceMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size={isDesktop ? "lg" : "sm"}
                  className=""
                  disabled={createWorkspaceMutation.isPending}
                >
                  {createWorkspaceMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin" />
                    </span>
                  ) : (
                    <p>Create Workspace</p>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
