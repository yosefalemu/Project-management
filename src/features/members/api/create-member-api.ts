import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
type ResponseType = InferResponseType<(typeof client.api.members)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.members)["$post"]>;

export const useCreateMember = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }): Promise<ResponseType> => {
      const response = await client.api.members["$post"]({ json });
      if (!response.ok) {
        throw new Error("An error occurred while creating member");
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMembers"] });
    },
  });
  return mutation;
};
