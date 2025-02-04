"use client";
import DootedSeparator from "@/components/dooted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "lucide-react";
import { useTaskModalHook } from "../hooks/use-task-modal";

export default function TaskViewSwitcher() {
  const { open } = useTaskModalHook();
  return (
    <Tabs className="w-full border rounded-lg flex-1">
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
        {/* TODO ADD FILTES */}
        <DootedSeparator className="my-4" />
        <>
          <TabsContent value="table">Data table</TabsContent>
          <TabsContent value="kanban">Kanban</TabsContent>
          <TabsContent value="calendar">Calender</TabsContent>
        </>
      </div>
    </Tabs>
  );
}
