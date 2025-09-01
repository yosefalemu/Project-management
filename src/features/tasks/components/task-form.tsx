"use client";
import CustomInputLabel from "@/components/inputs/custom-input-label";
import CustomTextareaLabel from "@/components/inputs/custom-textarea-label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTaskModalHook } from "../hooks/use-task-modal";
import { CustomDatePicker } from "@/components/inputs/custom-date-picker";
import CustomSelectInput from "@/components/inputs/custom-select-input";
import { useParams } from "next/navigation";
import { useCreateTask } from "../api/create-task-api";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Task, TaskStatus } from "../constant/types";
import {
  updateTaskSchema,
  updateTaskSchemaType,
} from "@/features/tasks/validators/update-task";
import {
  createTaskSchema,
  createTaskSchemaType,
} from "@/features/tasks/validators/create-task";
import { useUpdateTask } from "../api/update-task";
import { useMedia } from "react-use";

interface TaskFormProps {
  membersOptions: { id: string; name: string }[];
  task?: Task;
  setIsTaskModalOpen?: (isOpen: boolean) => void;
}

export default function TaskForm({
  membersOptions,
  task,
  setIsTaskModalOpen,
}: TaskFormProps) {
  const params = useParams();
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const { taskStatus, close } = useTaskModalHook();
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask();

  const TaskStatusFound = [
    { id: TaskStatus.BACKLOG, name: "Backlog" },
    { id: TaskStatus.TODO, name: "Todo" },
    { id: TaskStatus.IN_PROGRESS, name: "In Progress" },
    { id: TaskStatus.IN_REVIEW, name: "In Review" },
    { id: TaskStatus.DONE, name: "Done" },
  ];

  const createTaskForm = useForm<createTaskSchemaType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      description: "",
      assignedTo: "",
      projectId: params.projectId as string,
      status: taskStatus || TaskStatus.BACKLOG,
      dueDate: undefined,
    },
  });

  const updateTaskForm = useForm<updateTaskSchemaType>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      id: task?.id || "",
      name: task?.name || "",
      description: task?.description || "",
      assignedTo: task?.assignedTo || "",
      projectId: task?.projectId || "",
      status:
        typeof task?.status === "string"
          ? TaskStatus[task.status as keyof typeof TaskStatus]
          : (task?.status ?? TaskStatus.BACKLOG),
      dueDate: task?.dueDate || undefined,
    },
  });

  const handleCreateTask = (values: createTaskSchemaType) => {
    createTask(
      { json: values },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          close();
          createTaskForm.reset();
        },
        onError: (error) => {
          toast.error(error?.message || "An error occurred");
        },
      }
    );
  };
  const handleUpdateTask = (values: updateTaskSchemaType) => {
    updateTask(
      { json: values },
      {
        onSuccess: () => {
          toast.success("Task updated successfully");
          setIsTaskModalOpen?.(false);
        },
        onError: (error) => {
          toast.error(error?.message || "An error occurred");
        },
      }
    );
  };
  return (
    <div>
      {task ? (
        <div className="flex flex-col p-4 lg:p-6 w-full">
          <h1>Edit Task</h1>
          <Form {...updateTaskForm}>
            <form
              onSubmit={updateTaskForm.handleSubmit(handleUpdateTask)}
              className="grid md:grid-cols-2 gap-4 items-start"
            >
              <div className="col-span-1 space-y-2">
                <CustomInputLabel
                  fieldTitle="Task name"
                  nameInSchema="name"
                  placeHolder="Enter task name"
                  maxCharLength={50}
                />
                <CustomTextareaLabel
                  fieldTitle="Task Description"
                  nameInSchema="description"
                  placeHolder="Enter task description"
                  maxCharLength={1000}
                  rows={5}
                />
                <CustomDatePicker
                  fieldTitle="Due Date"
                  nameInSchema="dueDate"
                />
              </div>
              <div className="col-span-1 space-y-2 flex flex-col h-full">
                <CustomSelectInput
                  fieldTitle="Assigned Member"
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
                    variant="secondary"
                    size={isDesktop ? "lg" : "sm"}
                    type="button"
                    onClick={() => {
                      updateTaskForm.reset();
                      setIsTaskModalOpen?.(false);
                    }}
                    disabled={isUpdatingTask}
                  >
                    Cancel
                  </Button>
                  <Button
                    size={isDesktop ? "lg" : "sm"}
                    type="submit"
                    disabled={
                      isUpdatingTask || !updateTaskForm.formState.isDirty
                    }
                  >
                    {isUpdatingTask ? (
                      <span className="flex items-center justify-center">
                        <Loader className="animate-spin" />
                      </span>
                    ) : (
                      <p>Save Changes</p>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <div className="flex flex-col p-4 lg:p-6 w-full">
          <h1>Create Task</h1>
          <Form {...createTaskForm}>
            <form
              onSubmit={createTaskForm.handleSubmit(handleCreateTask)}
              className="grid md:grid-cols-2 gap-4 items-start"
            >
              <div className="col-span-1 space-y-2">
                <CustomInputLabel
                  fieldTitle="Task name"
                  nameInSchema="name"
                  placeHolder="Enter task name"
                  maxCharLength={50}
                />
                <CustomTextareaLabel
                  fieldTitle="Task Description"
                  nameInSchema="description"
                  placeHolder="Enter task description"
                  maxCharLength={1000}
                  rows={5}
                />
                <CustomDatePicker
                  fieldTitle="Due Date"
                  nameInSchema="dueDate"
                />
              </div>
              <div className="col-span-1 space-y-2 flex flex-col h-full">
                <CustomSelectInput
                  fieldTitle="Assigned Member"
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
                    variant="secondary"
                    size="lg"
                    type="button"
                    onClick={() => {
                      createTaskForm.reset();
                      close();
                    }}
                    disabled={isCreatingTask}
                  >
                    Cancel
                  </Button>
                  <Button size="lg" type="submit" disabled={isCreatingTask}>
                    {isCreatingTask ? (
                      <span className="flex items-center justify-center">
                        <Loader className="mr-2 animate-spin" />
                      </span>
                    ) : (
                      <p>Create Task</p>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
