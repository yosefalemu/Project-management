"use client";
import { useWorkspaceModalHook } from "@/features/workspace/hooks/use-workspace-modal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface MainPageClientProps {
  lastWorkspaceId?: string;
}
export default function MainPageClient({
  lastWorkspaceId,
}: MainPageClientProps) {
  const router = useRouter();
  const { open } = useWorkspaceModalHook();

  useEffect(() => {
    if (!lastWorkspaceId) {
      open();
    } else {
      router.push(`/${lastWorkspaceId}`);
    }
  }, [lastWorkspaceId, router, open]);

  return <div>DISPLAY NONE</div>;
}
