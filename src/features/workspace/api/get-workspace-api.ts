import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetWorkspace = (workspaceId: string | undefined) => {
  const query = useQuery({
    queryKey: ["workspace", { workspaceId }],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error("Workspace ID is required");
      }
      const response = await client.api.workspace[":workspaceId"].$get({
        param: { workspaceId },
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching workspace data");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
