"use client";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "./ui/button";
import { useRouter, useParams } from "next/navigation";

export default function BackButton() {
  const params = useParams();
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      className="flex items-center gap-x-2 text-neutral-500 cursor-pointer hover:text-neutral-800"
      onClick={() => router.push(`/workspaces/${params.workspaceId}`)}
    >
      <FaArrowLeft size={28} className="" />
      Back
    </Button>
  );
}
