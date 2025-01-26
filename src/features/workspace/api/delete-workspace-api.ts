import { QueryClient, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ZodErrorDetail = {
  name: string;
  issues: { message: string }[];
};
type ErrorResponse = {
  error?: ZodErrorDetail | string;
  message?: string;
  name?: string;
  userId?: string;
};

type ResponseType = InferResponseType<
  (typeof client.api.workspace)[":workspaceId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspace)[":workspaceId"]["$delete"]
>;

const queryClient = new QueryClient();

export const useDeleteWorkspace = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }): Promise<ResponseType> => {
      const response = await client.api.workspace[":workspaceId"]["$delete"]({
        param,
      });
      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        console.log("Error while deleting", errorData);
        if (
          typeof errorData.error === "object" &&
          "name" in errorData.error &&
          errorData.error.name === "ZodError"
        ) {
          const errorDataDetail =
            errorData.error.issues[0]?.message || "Validation error occurred";
          throw new Error(errorDataDetail);
        }
        throw new Error(
          errorData.message || "An error occurred while deleting"
        );
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
  return mutation;
};
