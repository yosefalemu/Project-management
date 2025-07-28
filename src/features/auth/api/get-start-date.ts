import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetStartDate = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["startDate", workspaceId],
    queryFn: async () => {
      const response = await client.api.auth["get-start-date"].$get({
        query: { workspaceId },
      });
      if (!response.ok) {
        return null;
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
