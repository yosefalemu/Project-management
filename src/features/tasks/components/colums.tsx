"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Task, TaskStatus } from "@/features/tasks/constant/types";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import TaskDate from "./task-date";
import { Badge } from "@/components/ui/badge";
import TaskActions from "./task-actions";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-3">
          Task Name
          <ArrowUpDown
            className="ml-2 h-4 w-4 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: "assignedId",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-3">
          Assigned To
          <ArrowUpDown
            className="ml-2 h-4 w-4 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const name = row.original.assignedUser.name;
      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-3">
          Due Date
          <ArrowUpDown
            className="ml-2 h-4 w-4 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      return <TaskDate value={dueDate} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-x-3">
          Status
          <ArrowUpDown
            className="ml-2 h-4 w-4 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={TaskStatus[status]} className="text-white text-xs">
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <TaskActions id={id}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVertical className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
