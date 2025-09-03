import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api)["channel-messages"][":channelId"]["$get"],
  200
>;

type ZodError = {
  name: string;
  issues: { message: string }[];
};

type ErrorResponse = {
  error: string | ZodError;
  message: string;
};

export const useGetChannelMessages = (channelId: string) => {
  const query = useQuery<ResponseType, ErrorResponse>({
    queryKey: ["channel-message", channelId],
    queryFn: async () => {
      const response = await client.api["channel-messages"][":channelId"].$get({
        param: { channelId },
      });
      if (!response.ok) {
        const error = (await response.json()) as ErrorResponse;
        throw new Error(error.message);
      }
      const data = await response.json();
      return data;
    },
  });
  return query;
};
