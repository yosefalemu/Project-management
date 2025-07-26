import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetStartDate = (workspaceId: string) => {
  console.log("Fetching start date for workspaceId:", workspaceId);
  const query = useQuery({
    queryKey: ["startDate", workspaceId],
    queryFn: async () => {
      const response = await client.api.auth["get-start-date"].$get({
        query: { workspaceId },
      });
      if (!response.ok) {
        return null;
      }
      console.log("Response received from get start date:", response);
      const { data } = await response.json();
      console.log("Start date data:", data);
      return data;
    },
  });
  return query;
};
