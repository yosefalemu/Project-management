"use client";
import DootedSeparator from "@/components/dooted-separator";
import CustomInputLabel from "@/components/inputs/custom-input-label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useCreateWorkspace } from "../api/create-workspace-api";
import { useUpdateWorkspace } from "../api/update-workspace-api";
import DangerZone from "./danger-zone";
import { useMedia } from "react-use";
import InviteCode from "./invite-code";
import { useWorkspaceModalHook } from "../hooks/use-workspace-modal";
import {
  updateWorkspaceSchema,
  updateWorkspaceSchemaType,
} from "../validators/update-workspace";

interface WorkSpaceFormProps {
  workspace?: getWorkspaceSchemaType;
}
export default function WorkSpaceForm({ workspace }: WorkSpaceFormProps) {
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
    <div className="h-full w-full flex flex-col gap-y-4 max-h-[550px] overflow-y-auto pb-14 hide-scrollbar">
      <Card className="shadow-none border-none w-full ">
        <CardHeader className="border-b-2">
          <CardTitle>
            {workspace ? "Edit Workspace" : "Create Workspace"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {workspace ? (
            <Form {...updateWorkspaceForm}>
              <form
                onSubmit={updateWorkspaceForm.handleSubmit(
                  handleUpdateWorkspace
                )}
              >
                <div className="flex items-start gap-4">
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
                  <DootedSeparator className="block xl:hidden py-7" />
                  <div className="flex flex-col gap-y-4 w-full">Column Two</div>
                </div>
                <div className="flex items-center justify-end gap-x-4">
                  <Button
                    type="button"
                    size={isDesktop ? "lg" : "sm"}
                    variant="secondary"
                    onClick={() => {
                      updateWorkspaceForm.reset();
                      close();
                    }}
                    disabled={updateWorkspaceMutation.isPending}
                  >
                    Cancel
                  </Button>
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
                  />
                  <DangerZone workspaceId={workspace.id!} />
                </div>
              </form>
            </Form>
          ) : (
            <Form {...createWorkspaceForm}>
              <form
                onSubmit={createWorkspaceForm.handleSubmit(
                  handleCreateWorkspace
                )}
              >
                <div className="flex flex-col xl:flex-row items-start gap-4">
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
                  <DootedSeparator className="block xl:hidden py-7" />
                  <div className="flex flex-col gap-y-4 w-full">Column Two</div>
                </div>
                <DootedSeparator className="py-7" />
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
        </CardContent>
      </Card>
    </div>
  );
}
