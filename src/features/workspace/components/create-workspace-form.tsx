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
import { LoaderCircle } from "lucide-react";
import DisplayServerActionResponse from "@/components/DisplayServerActionResponse";
import CustomImageUploader from "@/components/inputs/custom-image-upload";
import CustomTextareaLabel from "@/components/inputs/custom-textarea-label";
import { useCreateWorkspace } from "../api/create-workspace-api";

export default function CreateWorkSpaceForm() {
  const createWorkspaceMutation = useCreateWorkspace();
  const form = useForm<insertWorkspaceType>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
    },
  });

  const handleCreateWorkspace = (data: insertWorkspaceType) => {
    const finalValues = {
      name: data.name,
      description: data.description,
      image: data.image instanceof File ? data.image : "",
    };
    createWorkspaceMutation.mutate({ form: finalValues });
  };

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DootedSeparator />
      </div>
      <CardContent className="p-7">
        <DisplayServerActionResponse
          data={
            createWorkspaceMutation.data
              ? { message: "Workspace created successfully" }
              : undefined
          }
          error={
            createWorkspaceMutation.error
              ? { message: createWorkspaceMutation.error.message }
              : undefined
          }
          routePath="/"
          onReset={() => form.reset()}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateWorkspace)}>
            <div className="flex flex-col xl:flex-row items-start gap-4">
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
                  isPending={createWorkspaceMutation.isPending}
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
                size="lg"
                variant="secondary"
                onClick={() => form.reset()}
                disabled={createWorkspaceMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className=""
                disabled={createWorkspaceMutation.isPending}
              >
                {createWorkspaceMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <LoaderCircle className="mr-2 animate-spin" />
                    <p>Creating</p>
                  </span>
                ) : (
                  <p>Create Workspace</p>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
