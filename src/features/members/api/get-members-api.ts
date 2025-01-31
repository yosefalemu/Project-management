import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetMembers = (workspaceId: string | undefined) => {
  const query = useQuery({
    queryKey: ["getMembers"],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error("Workspace ID is required");
      }
      const response = await client.api.members[":workspaceId"].$get({
        param: { workspaceId },
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching members data");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
