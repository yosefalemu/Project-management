import { Loader } from "lucide-react";

export default function LoadingLayout() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Loader className="animate-spin text-neutral-400" size={42} />
    </div>
  );
}
