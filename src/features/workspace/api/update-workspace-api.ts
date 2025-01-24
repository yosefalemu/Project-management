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

type ResponseType = InferResponseType<(typeof client.api.workspace)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.workspace)["$post"]>;

const queryClient = new QueryClient();

export const useUpdateWorkspace = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }): Promise<ResponseType> => {
      const response = await client.api.workspace["$patch"]({ form });
      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        console.log("Error while updating", errorData);
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
          errorData.message || "An error occurred while updating"
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
