import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.channels)["all-channels"]["$get"],
  200
>;

type ZodError = {
  name: string;
  issues: { message: string }[];
};
type ErrorResponse = {
  error: ZodError | string;
  message: string;
};

export const useGetAllChannels = () => {
  const query = useQuery<ResponseType, ErrorResponse>({
    queryKey: ["all-channels"],
    queryFn: async () => {
      const response = await client.api.channels["all-channels"].$get();
      if (!response.ok) {
        throw new Error("Failed to fetch channels");
      }
      const data = await response.json();
      return data;
    },
  });
  return query;
};
