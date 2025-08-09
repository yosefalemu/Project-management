import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.workspace)["$patch"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.workspace)["$patch"]>;

type ErrorResponse = InferResponseType<
  (typeof client.api.workspace)["$patch"],
  500
>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
    mutationFn: async ({ form }): Promise<ResponseType> => {
      const response = await client.api.workspace["$patch"]({ form });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "An error occurred while updating workspace"
        );
      }
      const data = await response.json();
      return data;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
  });
  return mutation;
};
