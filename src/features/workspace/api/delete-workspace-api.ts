import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.workspace)[":workspaceId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspace)[":workspaceId"]["$delete"]
>;

type ErrorResponseType = InferResponseType<
  (typeof client.api.workspace)[":workspaceId"]["$delete"],
  500
>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, ErrorResponseType, RequestType>({
    mutationFn: async ({ param }): Promise<ResponseType> => {
      const response = await client.api.workspace[":workspaceId"]["$delete"]({
        param,
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Error occurred while deleting workspace");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
  return mutation;
};
