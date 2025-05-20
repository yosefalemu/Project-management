"use client";
import DootedSeparator from "@/components/dooted-separator";
import CustomInputLabel from "@/components/inputs/custom-input-label";
import CustomTextareaLabel from "@/components/inputs/custom-textarea-label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import {
  insertTaskSchema,
  insertTaskSchemaType,
} from "@/zod-schemas/task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTaskModalHook } from "../hooks/use-task-modal";
import { CustomDatePicker } from "@/components/inputs/custom-date-picker";
import CustomSelectInput from "@/components/inputs/custom-select-input";
import { useParams } from "next/navigation";
import { useCreateTask } from "../api/create-task-api";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { TaskStatus } from "../constant/types";

interface TaskFormProps {
  membersOptions: { id: string; name: string }[];
}
export default function TaskForm({ membersOptions }: TaskFormProps) {
  const params = useParams();
  const { mutate, isPending } = useCreateTask();
  const { close } = useTaskModalHook();
  const TaskStatusFound = [
    { id: TaskStatus.BACKLOG, name: "Backlog" },
    { id: TaskStatus.TODO, name: "Todo" },
    { id: TaskStatus.IN_PROGRESS, name: "In Progress" },
    { id: TaskStatus.IN_REVIEW, name: "In Review" },
    { id: TaskStatus.DONE, name: "Done" },
  ];
  const form = useForm<insertTaskSchemaType>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      name: "",
      description: "",
      assignedTo: "",
      projectId: params.projectId as string,
      status: "BACKLOG",
      dueDate: new Date(),
    },
  });

  const handleCreateTask = (values: insertTaskSchemaType) => {
    mutate(
      { json: values },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          close();
          form.reset();
        },
        onError: (error) =>
          toast.error(error ? error.message : "An error occurred"),
      }
    );
  };

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="p-7">
        <CardTitle>Create Task</CardTitle>
      </CardHeader>
      <DootedSeparator className="px-7 mb-4" />
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateTask)}
            className="grid md:grid-cols-2 gap-4 items-start"
          >
            <div className="col-span-1 space-y-2">
              <CustomInputLabel
                fieldTitle="Task name"
                nameInSchema="name"
                placeHolder="Enter task name"
                maxCharLength={15}
              />
              <CustomTextareaLabel
                fieldTitle="Task Description"
                nameInSchema="description"
                placeHolder="Enter task description"
                maxCharLength={500}
                rows={5}
              />
              <CustomDatePicker fieldTitle="Due Date" nameInSchema="dueDate" />
            </div>
            <div className="col-span-1 space-y-2 flex flex-col h-full">
              <CustomSelectInput
                fieldTitle="Assiggned Member"
                nameInSchema="assignedTo"
                data={membersOptions}
                placeHolder="Select assignee"
              />
              <CustomSelectInput
                fieldTitle="Status"
                nameInSchema="status"
                data={TaskStatusFound}
                placeHolder="Select status"
              />
              <div className="flex items-end justify-end gap-x-6 flex-1">
                <Button
                  variant="destructive"
                  size="lg"
                  type="button"
                  onClick={() => {
                    form.reset();
                    close();
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button size="lg" type="submit" disabled={isPending}>
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader className="mr-2 animate-spin" />
                      <p>Creating</p>
                    </span>
                  ) : (
                    <p>Create Workspace</p>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
