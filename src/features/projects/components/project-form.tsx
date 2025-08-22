"use client";
import CustomImageUploader from "@/components/inputs/custom-image-upload";
import CustomInputLabel from "@/components/inputs/custom-input-label";
import CustomTextareaLabel from "@/components/inputs/custom-textarea-label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMedia } from "react-use";
import { useCreateProject } from "../api/create-project-api";
import { useUpdateProject } from "../api/update-project-api";
import { Loader } from "lucide-react";
import DangerZone from "./danger-zone";
import {
  createProjectSchemaType,
  createProjectSchema,
} from "../validators/create-project";
import {
  updateProjectSchema,
  updateProjectSchemaType,
} from "../validators/update-project";
import CustomCheckBox from "@/components/inputs/custom-checkbox";
import { useEffect } from "react";

interface Project {
  id: string;
  name: string;
  image?: string | null;
  role: "admin" | "member" | "viewer";
}

interface ProjectFormProps {
  project?: {
    image: string | null;
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    creatorId: string;
    inviteCode: string | null;
    workspaceId: string;
    isPrivate: boolean;
  };
  role?: "admin" | "member" | "viewer";
  setSelectedProject?: (project: Project | null) => void;
  setIsModalOpen: (open: boolean) => void;
}
export default function ProjectForm({
  project,
  setSelectedProject,
  role,
  setIsModalOpen,
}: ProjectFormProps) {
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

  useEffect(() => {
    if (project) {
      updateProjectForm.reset({
        name: project.name,
        description: project.description,
        image: project.image || "",
        isPrivate: project.isPrivate,
      });
    }
  }, [project, updateProjectForm]);

  const handleCreateProject = (values: createProjectSchemaType) => {
    createProjectMutation.mutate({
      json: values,
    });
  };

  const handleUpdateProject = (values: updateProjectSchemaType) => {
    updateProjectMutation.mutate(
      {
        json: values,
      },
      {
        onSuccess: ({ data }) => {
          if (setSelectedProject && role) {
            setSelectedProject({
              id: data.id,
              name: data.name,
              image: data.image,
              role: role,
            });
          }
        },
      }
    );
  };

  return (
    <div className="h-full w-full flex flex-col gap-y-4">
      {project ? (
        <div className="w-full p-5">
          <div className="text-xl font-bold">
            Update Project - {project.name}
          </div>
          <div>
            <Form {...updateProjectForm}>
              <form
                onSubmit={updateProjectForm.handleSubmit(handleUpdateProject)}
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
                  {!updateProjectForm.formState.isDirty ? (
                    <Button
                      type="button"
                      size={isDesktop ? "lg" : "sm"}
                      variant="secondary"
                      onClick={() => {
                        setIsModalOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size={isDesktop ? "lg" : "sm"}
                      variant="secondary"
                      onClick={() => {
                        updateProjectForm.reset();
                      }}
                      disabled={updateProjectMutation.isPending}
                    >
                      Reset
                    </Button>
                  )}
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
                <DangerZone projectId={project.id!} />
              </form>
            </Form>
          </div>
        </div>
      ) : (
        <div className="w-full p-4">
          <div className="text-xl font-bold">Create Project</div>
          <div>
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
                      setIsModalOpen(false);
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
          </div>
        </div>
      )}
    </div>
  );
}
