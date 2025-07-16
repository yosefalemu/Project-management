"use client";
import { RootState } from "@/store";
import { Loader } from "lucide-react";
import { useSelector } from "react-redux";

export default function LoadingLayout() {
  const { isLoading } = useSelector((state: RootState) => state.loading);
  return (
    <div
      className={`${
        isLoading
          ? "absolute h-full w-full flex items-center justify-center bg-primary rounded-md z-50"
          : "hidden"
      }`}
    >
      <Loader className="animate-spin text-neutral-400" size={24} />
    </div>
  );
}
