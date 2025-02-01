"use client";
import { useParams } from "next/navigation";

export default function WorkspacePage() {
  const params = useParams();

  return <div className="h-full bg-violet-500">{params.workspaceId}</div>;
}
