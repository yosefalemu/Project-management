import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetChannelProps {
  channelId: string;
}

export const useGetChannel = ({ channelId }: UseGetChannelProps) => {
  const query = useQuery({
    queryKey: ["channel", channelId],
    queryFn: async () => {
      const response = await client.api.channels["single-channel"][
        ":channelId"
      ].$get({
        param: { channelId },
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
