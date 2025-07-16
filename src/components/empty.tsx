import { FolderOpen } from "lucide-react";

type EmptyProps = {
  title?: string;
  description?: string;
  className?: string;
};
export default function Empty({
  title = "No Data Available",
  description = "There is no data to display at the moment.",
}: EmptyProps) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FolderOpen className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
