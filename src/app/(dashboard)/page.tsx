"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetWorkspaces } from "@/features/workspace/api/get-workspaces-api";
import { setLoading } from "@/store/loading-slice";
import { useWorkspaceModalHook } from "@/features/workspace/hooks/use-workspace-modal";
import LoadingLayout from "@/components/loading-layout";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { open } = useWorkspaceModalHook();

  const { data, isLoading, isError, isRefetching, refetch } =
    useGetWorkspaces();

  const loading = isLoading || isRefetching;
  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (!loading && !isError && data) {
      if (data.length === 0) {
        open();
      } else {
        router.push(`/workspaces/${data[0].id}`);
      }
    }
  }, [loading, isError, data, router, refetch, open]);

  return (
    <div className="h-full">
      {!loading && isError ? (
        <div>Error</div>
      ) : loading && !isError ? (
        <LoadingLayout />
      ) : null}
    </div>
  );
}
