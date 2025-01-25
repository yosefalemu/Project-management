"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

export default function MemberComponent({
  workspacesId,
}: {
  workspacesId: string;
}) {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col items-start gap-x-2">
      <Button
        variant="ghost"
        className="flex items-center gap-x-2 text-neutral-500 cursor-pointer hover:text-neutral-800"
        onClick={() => router.push(`/workspaces/${workspacesId}`)}
      >
        <FaArrowLeft size={28} className="" />
        Back
      </Button>
    </div>
  );
}
