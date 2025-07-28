"use client";
import DootedSeparator from "@/components/dooted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import { useTaskModalHook } from "../hooks/use-task-modal";
import { useGetTasks } from "../api/get-tasks-api";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import DataFilters from "./data-filters";
import { useTaskFilters } from "../hooks/use-task-filters";
import { DataTable } from "./data-table";
import { columns } from "./colums";
import { Task, TaskStatus } from "../constant/types";
import DataKanban from "./data-kanban";
import { useCallback } from "react";
import { useUpdateBulkTask } from "../api/update-bulk-task";
import { useDispatch } from "react-redux";
import { setLoading } from "@/store/loading-slice";
import { toast } from "sonner";
import DataCalendar from "./data-calendar";

export default function TaskViewSwitcher() {
  const params = useParams();
  const dispatch = useDispatch();
  const [view, setView] = useQueryState("task-view", { defaultValue: "table" });
  const { open } = useTaskModalHook();
  const [{ status, search, assigneedId, dueDate }] = useTaskFilters();
  const { data, isPending } = useGetTasks({
    workspaceId: params.workspaceId as string,
    projectId: params.projectId as string,
    status,
    search,
    assigneedId,
    dueDate,
  });

  const { mutate: updateBulkTask } = useUpdateBulkTask();

  const onKanbanChange = useCallback(
    (tasks: { id: string; position: number; status: TaskStatus }[]) => {
      dispatch(setLoading(true));
      updateBulkTask(
        { json: { tasks } },
        {
          onSuccess: () => {
            dispatch(setLoading(false));
            toast.success("Tasks updated successfully");
          },
          onError: () => {
            dispatch(setLoading(false));
            toast.error("Failed to update tasks");
          },
        }
      );
    },
    [updateBulkTask, dispatch]
  );

  return (
    <Tabs className="flex-1 overflow-auto" value={view} onValueChange={setView}>
      <div className="h-full flex flex-col">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto h-8 bg-primary/75 rounded-sm">
            <TabsTrigger
              value="table"
              className="w-full lg:w-auto data-[state=active]:bg-primary-foreground data-[state=active]:text-primary rounded-sm"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              value="kanban"
              className="w-full lg:w-auto data-[state=active]:bg-primary-foreground data-[state=active]:text-primary rounded-sm"
            >
              Kanban
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="w-full lg:w-auto data-[state=active]:bg-primary-foreground data-[state=active]:text-primary rounded-sm"
            >
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            size="sm"
            className="w-full lg:w-auto"
            onClick={() => open(TaskStatus.BACKLOG)}
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>
        <DootedSeparator className="my-4" />
        <DataFilters hideProjectFilter={false} />
        <DootedSeparator className="my-4" />
        <>
          {isPending ? (
            <div className="flex justify-center items-center h-64 border rounded-lg">
              <Loader className="animate-spin" />
            </div>
          ) : (
            <div className="h-[calc(100vh-240px)] max-w-[calc(100vw-255px)] overflow-auto hide-scrollbar">
              <TabsContent value="table" className="w-full">
                <DataTable data={data as Task[]} columns={columns} />
              </TabsContent>
              <TabsContent value="kanban">
                <DataKanban data={data as Task[]} onChange={onKanbanChange} />
              </TabsContent>
              <TabsContent value="calendar">
                <DataCalendar data={data as Task[]} />
              </TabsContent>
            </div>
          )}
        </>
      </div>
    </Tabs>
  );
}
