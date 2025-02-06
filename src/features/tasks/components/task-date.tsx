import { differenceInDays, format } from "date-fns";
import { cn } from "@/lib/utils";
interface TaskDateProps {
  value: string;
  className?: string;
}
export default function TaskDate({ value, className }: TaskDateProps) {
  const today = new Date();
  const endDate = new Date(value);
  const difference = differenceInDays(endDate, today);
  let textColor = "text-muted-foreground";
  if (difference <= 3) {
    textColor = "text-red-500";
  } else if (difference <= 7) {
    textColor = "text-yellow-500";
  } else if (difference <= 14) {
    textColor = "text-green-500";
  }

  return (
    <div className={textColor}>
      <span className={cn("truncate", className)}>{format(value, "PPP")}</span>
    </div>
  );
}
