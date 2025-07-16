"use client";
import { useParams } from "next/navigation";

export default function WorkspacePage() {
  const params = useParams();

  return <div className="h-full">{params.workspaceId}</div>;
}
