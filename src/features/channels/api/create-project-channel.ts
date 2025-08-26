import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.channels.create)["$post"],
  201
>;

type RequestType = InferRequestType<
  (typeof client.api.channels.create)["$post"]
>;

type ZodError = {
  name: string;
  issues: { message: string }[];
};
type ErrorResponse = {
  error: string | ZodError;
  message: string;
};

export const useCreateProjectChannel = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
    mutationKey: ["createProjectChannel"],
    mutationFn: async ({ json }) => {
      const response = await client.api.channels["create"].$post({
        json,
      });
      if (!response.ok) {
        throw new Error("An error occurred while creating the channel");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: async ({ data }) => {
      await queryClient.invalidateQueries({
        queryKey: ["getChannel", data.projectId],
      });
    },
  });

  return mutation;
};
