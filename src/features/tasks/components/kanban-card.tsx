import { MoreHorizontal } from "lucide-react";
import { Task } from "../constant/types";
import TaskActions from "./task-actions";
import MemberAvatar from "@/features/members/components/member-avatar";
import TaskDate from "./task-date";
import { Card } from "@/components/ui/card";

interface KanbanCardProps {
  task: Task;
}
export default function KanbanCard({ task }: KanbanCardProps) {
  return (
    <Card className="p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task.id}>
          <MoreHorizontal className="cursor-pointer" />
        </TaskActions>
      </div>
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={task.assignedUser.name!}
          className="size-6 text-xs"
        />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
    </Card>
  );
}
