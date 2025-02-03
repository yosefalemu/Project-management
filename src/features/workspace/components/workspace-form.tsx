"use client";
import DootedSeparator from "@/components/dooted-separator";
import CustomInputLabel from "@/components/inputs/custom-input-label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  createWorkspaceSchema,
  insertWorkspaceType,
} from "@/zod-schemas/workspace-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import CustomImageUploader from "@/components/inputs/custom-image-upload";
import CustomTextareaLabel from "@/components/inputs/custom-textarea-label";
import { useCreateWorkspace } from "../api/create-workspace-api";
import { useUpdateWorkspace } from "../api/update-workspace-api";
import { useRouter } from "next/navigation";
import DangerZone from "./danger-zone";
import { useMedia } from "react-use";
import { useState } from "react";
import InviteCode from "./invite-code";
import { toast } from "sonner";
import BackButton from "@/components/back-button";

interface WorkSpaceFormProps {
  workspace?: insertWorkspaceType;
  onModal?: boolean;
}
export default function WorkSpaceForm({
  workspace,
  onModal = false,
}: WorkSpaceFormProps) {
  const router = useRouter();
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const createWorkspaceMutation = useCreateWorkspace();
  const updateWorkspaceMutation = useUpdateWorkspace();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [isResetInviteCodeLoading, setIsResetInviteCodeLoading] =
    useState<boolean>(false);

  const form = useForm<insertWorkspaceType>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      id: workspace?.id ?? undefined,
      name: workspace?.name ?? "",
      image: workspace?.image ?? "",
      description: workspace?.description ?? "",
    },
  });

  const handleCreateWorkspace = (values: insertWorkspaceType) => {
    if (workspace) {
      const finalValues = {
        id: workspace.id ?? undefined,
        name: values.name,
        description: values.description,
        image: values.image instanceof File ? values.image : "",
      };
      updateWorkspaceMutation.mutate(
        { form: finalValues },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: (data: any) => {
            toast.success("Workspace updated successfully");
            if (data) {
              router.push(`/workspaces/${data.data.id}`);
            }
          },
          onError: () => {
            toast.error(
              updateWorkspaceMutation.error
                ? updateWorkspaceMutation.error.message
                : "An error occured"
            );
          },
        }
      );
    } else {
      const finalValues = {
        name: values.name,
        description: values.description,
        image: values.image instanceof File ? values.image : "",
      };
      createWorkspaceMutation.mutate(
        { form: finalValues },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: (data: any) => {
            toast.success("Workspace created successfully");
            if (data) {
              router.push(`/workspaces/${data.data.id}`);
            }
          },
          onError: () => {
            toast.error(
              createWorkspaceMutation.error
                ? createWorkspaceMutation.error.message
                : "An error occured"
            );
          },
        }
      );
    }
  };

  return (
    <div className="h-full w-full flex flex-col gap-y-4">
      <Card
        className={`shadow-none border-none w-full ${
          onModal ? "" : "bg-neutral-50"
        }`}
      >
        <CardHeader className="flex flex-row items-center gap-x-4 p-7">
          {!onModal && <BackButton />}
          <CardTitle className="text-xl font-bold">
            {workspace ? "Edit workspace" : "Create a new workspace"}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DootedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateWorkspace)}>
              <div
                className={`flex flex-col items-start gap-4 ${
                  onModal ? "" : "xl:flex-row"
                }`}
              >
                <div className="flex flex-col gap-y-4 w-full">
                  <CustomInputLabel
                    fieldTitle="Workspace Name"
                    nameInSchema="name"
                    placeHolder="Enter workspace name"
                    className=""
                    maxCharLength={15}
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
                    isPending={
                      createWorkspaceMutation.isPending ||
                      updateWorkspaceMutation.isPending ||
                      isDeleteLoading
                    }
                    className=""
                  />
                </div>
                <DootedSeparator className="block xl:hidden py-7" />
                <div className="flex flex-col gap-y-4 w-full">Column Two</div>
              </div>
              <DootedSeparator className="py-7" />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  size={isDesktop ? "lg" : "sm"}
                  variant="secondary"
                  onClick={() => form.reset()}
                  disabled={
                    createWorkspaceMutation.isPending ||
                    updateWorkspaceMutation.isPending ||
                    isDeleteLoading ||
                    isResetInviteCodeLoading
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size={isDesktop ? "lg" : "sm"}
                  className=""
                  disabled={
                    createWorkspaceMutation.isPending ||
                    updateWorkspaceMutation.isPending ||
                    isDeleteLoading ||
                    isResetInviteCodeLoading
                  }
                >
                  {createWorkspaceMutation.isPending ||
                  updateWorkspaceMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader className="mr-2 animate-spin" />
                      <p>{workspace ? "Editing" : "Creating"}</p>
                    </span>
                  ) : (
                    <p>{workspace ? "Edit workspace" : "Create Workspace"}</p>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {workspace && (
        <div className="flex flex-col gap-y-4">
          <InviteCode
            workspaceId={workspace.id!}
            inviteCode={workspace.inviteCode!}
            loadingState={
              createWorkspaceMutation.isPending ||
              updateWorkspaceMutation.isPending ||
              isDeleteLoading ||
              isResetInviteCodeLoading
            }
            setIsResetInviteCodeLoading={setIsResetInviteCodeLoading}
          />
          <DangerZone
            workspaceId={workspace.id!}
            loadingState={
              createWorkspaceMutation.isPending ||
              updateWorkspaceMutation.isPending ||
              isDeleteLoading ||
              isResetInviteCodeLoading
            }
            setIsDeleteLoading={setIsDeleteLoading}
          />
        </div>
      )}
    </div>
  );
}
