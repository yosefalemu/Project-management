import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspace)["$patch"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.workspace)["$patch"]>;

type ZodError = {
  name: string;
  issues: { message: string }[];
};

type ErrorResponse = {
  error: ZodError | string;
  message: string;
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
    mutationFn: async ({ json }): Promise<ResponseType> => {
      const response = await client.api.workspace["$patch"]({ json });
      if (!response.ok) {
        const error = (await response.json()) as ErrorResponse;
        if (
          typeof error.error === "object" &&
          "name" in error.error &&
          error.error.name === "ZodError"
        ) {
          const validataionErrors = error.error.issues.map(
            (issue) => issue.message
          );
          throw new Error(validataionErrors.join(", "));
        }
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
      toast.success("Workspace updated successfully");
    },
    onError: ({ message }) => {
      const messages = message.split(", ");
      messages.forEach((msg, index) =>
        setTimeout(() => {
          toast.error(msg || "An error occurred while updating workspace");
        }, index * 3000)
      );
    },
  });
  return mutation;
};
