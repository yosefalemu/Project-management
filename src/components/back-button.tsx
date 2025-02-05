"use client";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  backTo: string;
}
export default function BackButton({ backTo }: BackButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="flex items-center gap-x-2 text-neutral-500 cursor-pointer hover:text-neutral-800 border-neutral-50/50 shadow-none border-none"
      onClick={() => router.push(`${backTo}`)}
    >
      <FaArrowLeft size={28} className="" />
      Back
    </Button>
  );
}
