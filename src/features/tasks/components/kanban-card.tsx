import { MoreVertical } from "lucide-react";
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
        <TaskActions task={task}>
          <MoreVertical className="cursor-pointer size-4" />
        </TaskActions>
      </div>
      <div className="flex items-center gap-x-3">
        <MemberAvatar
          name={task.assignedUser.name!}
          image={task.assignedUser.image ?? undefined}
          className="size-6 text-xs rounded-sm"
        />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
    </Card>
  );
}
