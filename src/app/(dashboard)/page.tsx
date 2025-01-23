"use client";
import { useCurrentGetWorkspace } from "@/features/workspace/api/current-workspace-api";
import { redirect } from "next/navigation";

export default function LandingPage() {
  const { data, isPending, isError } = useCurrentGetWorkspace();
  console.log("Current workspace", data);
  <>
    {isPending ? (
      <div>Loading...</div>
    ) : isError ? (
      <div>Error</div>
    ) : data.length === 0 ? (
      redirect("workspaces/create")
    ) : (
      redirect(`workspaces/${data[0].id}`)
    )}
  </>;
}
