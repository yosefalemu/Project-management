"use client";
import CustomImageUploader from "@/components/inputs/custom-image-upload";
import CustomInputLabel from "@/components/inputs/custom-input-label";
import CustomTextareaLabel from "@/components/inputs/custom-textarea-label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { insertProjectType } from "@/zod-schemas/project-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";
import { useCreateProject } from "../api/create-project-api";
import { useParams } from "next/navigation";
import { useUpdateProject } from "../api/update-project-api";
import { Loader } from "lucide-react";
import DangerZone from "./danger-zone";
import { useState } from "react";
import {
  createProjectSchemaType,
  createProjectSchema,
} from "../validators/create-project";
import {
  updateProjectSchema,
  updateProjectSchemaType,
} from "../validators/update-project";
import CustomCheckBox from "@/components/inputs/custom-checkbox";

interface ProjectFormProps {
  onModal?: boolean;
  project?: insertProjectType;
}
export default function ProjectForm({ project }: ProjectFormProps) {
  const params = useParams();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const isDesktop = useMedia("(min-width: 1024px)", true);

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  const createProjectForm = useForm<createProjectSchemaType>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      isPrivate: false,
    },
  });

  const updateProjectForm = useForm<updateProjectSchemaType>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      image: (project?.image as string) ?? "",
      isPrivate: project?.isPrivate ?? false,
    },
  });

  const handleCreateProject = (values: createProjectSchemaType) => {
    createProjectMutation.mutate({
      json: values,
    });
  };

  const handleUpdateProject = (values: updateProjectSchemaType) => {
    updateProjectMutation.mutate({
      json: values,
    });
  };

  return (
    <div className="h-full w-full flex flex-col gap-y-4">
      {project ? (
        <Card className="shadow-none border-none w-full">
          {/* <CardHeader className="flex flex-row items-baseline gap-x-4 p-7">
            <CardTitle className="text-xl font-bold">Edit Project</CardTitle>
          </CardHeader> */}
          <CardContent>
            <Form {...updateProjectForm}>
              <form
                onSubmit={updateProjectForm.handleSubmit(handleUpdateProject)}
                className="grid grid-cols-2 gap-4 overflow-y-auto hide-scrollbar max-h-[540px]"
              >
                <div className="col-span-2 xl:col-span-1 gap-2">
                  <CustomInputLabel
                    fieldTitle="Project Title"
                    nameInSchema="name"
                    placeHolder="Enter project name"
                    maxCharLength={50}
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
                  />
                </div>
                <div className="col-span-2 xl:col-span-1 gap-2">
                  <CustomCheckBox
                    nameInSchema="isPrivate"
                    fieldTitle="Private"
                  />
                </div>
                <div className="col-span-2 flex items-center justify-end gap-x-4">
                  <Button
                    type="button"
                    size={isDesktop ? "lg" : "sm"}
                    variant="secondary"
                    onClick={() => {
                      updateProjectForm.reset();
                    }}
                    disabled={updateProjectMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size={isDesktop ? "lg" : "sm"}
                    className=""
                    disabled={
                      updateProjectMutation.isPending ||
                      !updateProjectForm.formState.isDirty
                    }
                  >
                    {updateProjectMutation.isPending ? (
                      <span className="flex items-center justify-center">
                        <Loader className="animate-spin" />
                      </span>
                    ) : (
                      <p>Save changes</p>
                    )}
                  </Button>
                </div>
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
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-none border-none w-full">
          <CardHeader className="flex flex-row items-baseline gap-x-4 p-7">
            <CardTitle className="text-xl font-bold">Create Project</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...createProjectForm}>
              <form
                onSubmit={createProjectForm.handleSubmit(handleCreateProject)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="col-span-2 xl:col-span-1 gap-2">
                  <CustomInputLabel
                    fieldTitle="Project Title"
                    nameInSchema="name"
                    placeHolder="Enter project name"
                    maxCharLength={50}
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
                  />
                </div>
                <div className="col-span-2 xl:col-span-1 gap-2">
                  <CustomCheckBox
                    nameInSchema="isPrivate"
                    fieldTitle="Private"
                  />
                </div>
                <div className="col-span-2 flex items-center justify-end gap-x-4">
                  <Button
                    type="button"
                    size={isDesktop ? "lg" : "sm"}
                    variant="secondary"
                    onClick={() => {
                      createProjectForm.reset();
                    }}
                    disabled={createProjectMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size={isDesktop ? "lg" : "sm"}
                    className=""
                    disabled={createProjectMutation.isPending}
                  >
                    {createProjectMutation.isPending ? (
                      <span className="flex items-center justify-center">
                        <Loader className="mr-2 animate-spin" />
                      </span>
                    ) : (
                      <p>Create Project</p>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
