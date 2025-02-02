import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingComponent() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-y-4">
      <Skeleton className="bg-neutral-200 h-[440px]" />
      <Skeleton className="bg-neutral-200 h-64" />
      <Skeleton className="bg-neutral-200 h-64" />
    </div>
  );
}
