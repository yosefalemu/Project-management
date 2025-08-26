import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetUserChannelsProps {
  projectId: string;
  queryOptions?: {
    enabled?: boolean;
    staleTime?: number;
  };
}
export const useGetUserChannels = ({
  projectId,
  queryOptions,
}: UseGetUserChannelsProps) => {
  const query = useQuery({
    queryKey: ["getChannel", projectId],
    queryFn: async () => {
      const response = await client.api.channels[":projectId"].$get({
        param: { projectId },
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching channels data");
      }
      const { data } = await response.json();
      return data;
    },
    ...queryOptions,
  });
  return query;
};
