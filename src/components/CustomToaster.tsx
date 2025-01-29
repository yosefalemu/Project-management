"use client";

import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

export function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          toast: cn(
            "border-l-4 shadow-lg px-4 py-3 text-white font-medium",
            "transition-all duration-300 ease-in-out"
          ),
          success: "border-green-500 bg-green-600",
          error: "border-red-500 bg-red-600",
        },
      }}
    />
  );
}
