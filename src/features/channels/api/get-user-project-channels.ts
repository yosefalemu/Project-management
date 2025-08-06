import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseUserProjectChannelsProps {
  projectId: string;
}
export const useUserProjectChannels = ({
  projectId,
}: UseUserProjectChannelsProps) => {
  const query = useQuery({
    queryKey: ["getUserProjectChannel", projectId],
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
  });
  return query;
};
