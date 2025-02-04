import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetTaskProps {
  workspaceId: string;
}
export const useGetTasks = ({ workspaceId }: UseGetTaskProps) => {
  const query = useQuery({
    queryKey: ["getTasks"],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error("Workspace ID is required");
      }
      const response = await client.api.tasks.$get({
        query: { workspaceId },
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching task data");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
