import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { Task } from "../constant/types";

interface UseGetTaskProps {
  workspaceId: string;
  projectId: string;
  assigneedId?: string | null;
  status?: string | null;
  search?: string | null;
  dueDate?: string | null;
}
export const useGetTasks = ({
  workspaceId,
  projectId,
  assigneedId,
  status,
  search,
  dueDate,
}: UseGetTaskProps) => {
  const query = useQuery<Task[]>({
    queryKey: [
      "getTasks",
      projectId,
      workspaceId,
      assigneedId,
      status,
      search,
      dueDate,
    ],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error("Workspace ID is required");
      }
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId,
          assigneedTo: assigneedId ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
          dueDate: dueDate ?? undefined,
        },
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching task data");
      }

      const { data } = await response.json();
      if (!data) {
        throw new Error("No data found");
      }
      return data as unknown as Task[];
    },
  });
  return query;
};
