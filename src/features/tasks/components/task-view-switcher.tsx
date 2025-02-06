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

export default function TaskViewSwitcher() {
  const params = useParams();
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
                <DataTable data={data ?? []} columns={columns}/>
              </TabsContent>
              <TabsContent value="kanban">{JSON.stringify(data)}</TabsContent>
              <TabsContent value="calendar">{JSON.stringify(data)}</TabsContent>
            </>
          )}
        </>
      </div>
    </Tabs>
  );
}
