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

  console.log("FETCHED DATA", data);
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
    <Tabs
      className="w-full border rounded-lg flex-1"
      value={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="table" className="h-full w-full lg:w-auto">
              Table
            </TabsTrigger>
            <TabsTrigger value="kanban" className="h-full w-full lg:w-auto">
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calendar" className="h-full w-full lg:w-auto">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="mr-1 size-4" />
            New
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
            <>
              <TabsContent value="table" className="lg:w-auto">
                <DataTable data={data as Task[]} columns={columns} />
              </TabsContent>
              <TabsContent value="kanban">
                <DataKanban data={data as Task[]} onChange={onKanbanChange} />
              </TabsContent>
              <TabsContent value="calendar">
                <DataCalendar data={data as Task[]} />
              </TabsContent>
            </>
          )}
        </>
      </div>
    </Tabs>
  );
}
