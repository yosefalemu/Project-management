import { cn } from "@/lib/utils";
import { TaskStatus } from "../constant/types";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface EventCardProps {
  title: string;
  assignee: string;
  status: TaskStatus;
  id: string;
  image?: string | null;
}
export default function EventCard({
  title,
  assignee,
  id,
  status,
  image,
}: EventCardProps) {
  const router = useRouter();
  const params = useParams();
  const statusColorMatch: Record<TaskStatus, string> = {
    [TaskStatus.BACKLOG]: "border-l-pink-500",
    [TaskStatus.TODO]: "border-l-red-500",
    [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
    [TaskStatus.IN_REVIEW]: "border-l-blue-500",
    [TaskStatus.DONE]: "border-l-emerald-500",
  };
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspace/${params.workspaceId}/tasks/${id}`);
  };
  return (
    <div className="px-2 cursor-pointer">
      <Card
        className={cn(
          "p-1.5 text-sm border rounded-md border-l-4 flex flex-col gap-y-1.5 cusror-pointer hover:opacity-75 transition relative mb-1",
          statusColorMatch[status]
        )}
        onClick={onClick}
      >
        <p>{title}</p>
        {image && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-x-2 relative h-6 w-6">
              <Image
                src={image}
                alt={title}
                className="rounded-sm object-cover"
                fill
              />
            </div>
          </div>
        )}
        <p>{assignee}</p>
      </Card>
    </div>
  );
}
