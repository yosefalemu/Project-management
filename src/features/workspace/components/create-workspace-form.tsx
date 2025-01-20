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
import { useCreateWorkspace } from "../api/use-create-workspace";
import { LoaderCircle } from "lucide-react";
import DisplayServerActionResponse from "@/components/DisplayServerActionResponse";

interface CreateWorkSpaceFormProps {
  onCancel?: () => void;
}
export default function CreateWorkSpaceForm({
  onCancel,
}: CreateWorkSpaceFormProps) {
  const createWorkspaceMutation = useCreateWorkspace();
  const form = useForm<insertWorkspaceType>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleCreateWorkspace = (data: insertWorkspaceType) => {
    console.log("Values", data);
    createWorkspaceMutation.mutate({ json: data });
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
          onReset={() => createWorkspaceMutation.reset()}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateWorkspace)}>
            <div className="flex flex-col gap-y-4">
              <CustomInputLabel
                fieldTitle="Workspace Name"
                nameInSchema="name"
                placeHolder="Enter workspace name"
              />
              <CustomInputLabel
                fieldTitle="User Id"
                nameInSchema="userId"
                placeHolder="Enter user id"
              />
            </div>
            <DootedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
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
