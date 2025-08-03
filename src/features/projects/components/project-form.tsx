"use client";
import BackButton from "@/components/back-button";
import DootedSeparator from "@/components/dooted-separator";
import CustomImageUploader from "@/components/inputs/custom-image-upload";
import CustomInputLabel from "@/components/inputs/custom-input-label";
import CustomTextareaLabel from "@/components/inputs/custom-textarea-label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  createProjectSchema,
  insertProjectType,
} from "@/zod-schemas/project-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";
import { useCreateProject } from "../api/create-project-api";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useUpdateProject } from "../api/update-project-api";
import { Loader } from "lucide-react";
import { useProjectModalHook } from "../hooks/use-project-modal";
import DangerZone from "./danger-zone";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectFormProps {
  onModal?: boolean;
  project?: insertProjectType;
}
export default function ProjectForm({ onModal, project }: ProjectFormProps) {
  const params = useParams();
  const router = useRouter();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const { close } = useProjectModalHook();

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  const form = useForm<insertProjectType>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      id: project?.id ?? undefined,
      name: project?.name ?? "",
      description: project?.description ?? "",
      workspaceId: params.workspaceId as string,
      image: project?.image ?? "",
      creatorId: project?.creatorId ?? undefined,
      inviteCode: project?.inviteCode ?? undefined,
    },
  });

  const handleFormSubmit = (values: insertProjectType) => {
    if (project) {
      const finalValues = {
        id: project.id,
        name: values.name,
        description: values.description,
        image: values.image instanceof File ? values.image : "",
        workspaceId: values.workspaceId,
        creatorId: values.creatorId,
        inviteCode: values.inviteCode,
      };
      updateProjectMutation.mutate(
        { form: finalValues },
        {
          onSuccess: () => {
            toast.success("Project updated successfully");
            form.reset();
            // TODO::ADD THE DATA WHEN THE SERVER CODE ENDS
            // router.push(
            //   `/workspaces/${params.workspaceId}/projects/${data.id}`
            // );
            close();
          },
          onError: () => {
            toast.error(
              updateProjectMutation.error
                ? updateProjectMutation.error.message
                : "An error occurred while updating project"
            );
          },
        }
      );
    } else {
      const finalValues = {
        name: values.name,
        description: values.description,
        image: values.image instanceof File ? values.image : "",
        workspaceId: values.workspaceId,
      };
      createProjectMutation.mutate(
        { form: finalValues },
        {
          onSuccess: ({ data }) => {
            if (!data?.id) {
              toast.error("Project created but no ID returned");
              return;
            }
            toast.success("Project created successfully");
            form.reset();
            setTimeout(() => {
              router.push(`/${params.workspaceId}/projects/${data.id}`);
            }, 100);
            close();
          },

          onError: () => {
            toast.error(
              createProjectMutation.error
                ? createProjectMutation.error.message
                : "An error occurred while creating project"
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
        <CardHeader className="flex flex-row items-baseline gap-x-4 p-7">
          {!onModal && (
            <BackButton
              backTo={`/${params.workspaceId}/projects/${params.projectId}`}
            />
          )}
          <CardTitle className="text-xl font-bold">
            {project ? "Edit project" : "Create a new project"}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DootedSeparator />
        </div>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
              <CustomInputLabel
                fieldTitle="Project Title"
                nameInSchema="name"
                placeHolder="Enter project name"
                maxCharLength={15}
              />
              <CustomTextareaLabel
                fieldTitle="Project Description"
                nameInSchema="description"
                placeHolder="Enter project description"
                maxCharLength={500}
                rows={5}
              />
              <CustomImageUploader
                fieldTitle="Image"
                nameInSchema="image"
                isPending={false}
              />
              <DootedSeparator className="py-7" />
              <div className="flex items-center justify-end gap-x-4">
                <Button
                  type="button"
                  size={isDesktop ? "lg" : "sm"}
                  variant="secondary"
                  onClick={() => {
                    form.reset();
                    close();
                  }}
                  disabled={
                    createProjectMutation.isPending ||
                    updateProjectMutation.isPending
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size={isDesktop ? "lg" : "sm"}
                  className=""
                  disabled={
                    createProjectMutation.isPending ||
                    updateProjectMutation.isPending
                  }
                >
                  {createProjectMutation.isPending ||
                  updateProjectMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader className="mr-2 animate-spin" />
                      <p>{project ? "Editing" : "Creating"}</p>
                    </span>
                  ) : (
                    <p>{project ? "Edit project" : "Create Project"}</p>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {project && (
        <DangerZone
          projectId={project.id!}
          workspaceId={params.workspaceId as string}
          loadingState={
            createProjectMutation.isPending ||
            updateProjectMutation.isPending ||
            isDeleteLoading
          }
          setIsDeleteLoading={setIsDeleteLoading}
        />
      )}
    </div>
  );
}
