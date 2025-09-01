"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGetProjectMembers } from "@/features/projects/api/get-project-member-api";
import { ListChecksIcon, UserIcon, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskStatusType } from "@/features/workspace/constants/type";
import { DatePicker } from "@/components/DatePicker";
import { TaskStatus } from "../constant/types";
import { Button } from "@/components/ui/button";
import MemberAvatar from "@/features/members/components/member-avatar";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}
export default function DataFilters({ hideProjectFilter }: DataFiltersProps) {
  const params = useParams();
  const { data: members, isLoading: isLoadingMembers } = useGetProjectMembers({
    workspaceId: params.workspaceId as string,
    projectId: params.projectId as string,
  });

  const memberOptions = members?.map((member) => ({
    value: member.id,
    label: member.name,
    image: member.image ?? undefined,
  }));

  const [{ status, search, assigneedId, dueDate }, setFilters] =
    useTaskFilters();
  console.log(hideProjectFilter, search);
  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatusType) });
  };

  const onAssigneeChange = (value: string) => {
    setFilters({ assigneedId: value === "all" ? null : (value as string) });
  };

  const onClearDueDate = () => {
    setFilters({ dueDate: null });
  };

  const TaskStatusFound = [
    { id: TaskStatus.BACKLOG, name: "Backlog" },
    { id: TaskStatus.TODO, name: "Todo" },
    { id: TaskStatus.IN_PROGRESS, name: "In Progress" },
    { id: TaskStatus.IN_REVIEW, name: "In Review" },
    { id: TaskStatus.DONE, name: "Done" },
  ];

  if (isLoadingMembers) return null;
  return (
    <div className="flex flex-col lg:flex-row gap-2 py-2">
      <Select
        value={status ?? "all"}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-8">
            <SelectValue
              placeholder={
                <div className="flex items-center gap-2">
                  <ListChecksIcon className="size-4" />
                  <span>All statuses</span>
                </div>
              }
            />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <ListChecksIcon className="size-4" />
              <span>All statuses</span>
            </div>
          </SelectItem>
          <Separator />
          {TaskStatusFound?.map((status) => (
            <SelectItem value={status.id} key={status.id}>
              <div className="flex items-center gap-2">
                <MemberAvatar name={status.name} className="size-6 text-xs" />
                <span>{status.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={assigneedId ?? "all"}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-8">
            <SelectValue
              placeholder={
                <div className="flex items-center gap-2">
                  <UserIcon className="size-4" />
                  <span>All Members</span>
                </div>
              }
            />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <UserIcon className="size-4" />
              <span>All Members</span>
            </div>
          </SelectItem>
          <Separator />
          {memberOptions?.map((member) => (
            <SelectItem value={member.value!} key={member.value}>
              <div className="flex items-center gap-2">
                {member.image ? (
                  <MemberAvatar
                    name={member.label}
                    image={member.image}
                    className="size-6 text-xs"
                  />
                ) : (
                  <MemberAvatar
                    name={member.label}
                    className="size-6 text-xs"
                  />
                )}
                {member.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <DatePicker
          placeHolder="Due Date"
          className="h-8 w-full lg:w-auto"
          value={dueDate ? new Date(dueDate) : null}
          onChange={(date) =>
            setFilters({ dueDate: date ? date.toISOString() : null })
          }
        />
        {dueDate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearDueDate}
            className="h-8 w-8 p-0"
            title="Clear due date filter"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
