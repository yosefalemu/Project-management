"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetWorkspaces } from "@/features/workspace/api/get-workspaces-api";
import { setLoading } from "@/store/loading-slice";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data, isLoading, isError, isRefetching, refetch } =
    useGetWorkspaces();

  const loading = isLoading || isRefetching;
  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (!loading && !isError && data) {
      if (data.length === 0) {
        router.push("/workspaces/createworkspace");
      } else {
        router.push(`/workspaces/${data[0].id}`);
      }
    }
  }, [loading, isError, data, router, refetch]);

  return (
    <div className="h-full">
      {!loading && isError ? <div>Error</div> : null}
    </div>
  );
}
