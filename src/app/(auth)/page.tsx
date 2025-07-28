import { Loader2 } from "lucide-react";

export default function RootPage() {
  return (
    <div className="bg-red-500 h-full flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
