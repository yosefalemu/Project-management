import { useQueryClient, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspace)["$post"],
  201
>;
type RequestType = InferRequestType<(typeof client.api.workspace)["$post"]>;

type ZodError = {
  name: string;
  issues: { message: string }[];
};
type ErrorResponse = {
  error: string | ZodError;
  message: string;
};

export const useCreateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
    mutationFn: async ({ json }): Promise<ResponseType> => {
      const response = await client.api.workspace["$post"]({ json });
      if (!response.ok) {
        const error = (await response.json()) as ErrorResponse;
        if (
          typeof error.error === "object" &&
          "name" in error.error &&
          error.error.name === "ZodError"
        ) {
          const validationErrors = error.error.issues.map(
            (issue) => issue.message
          );
          throw new Error(validationErrors.join(", "));
        }
        throw new Error(
          error.message || "An error occurred while creating workspace"
        );
      }
      const data = await response.json();
      return data;
    },
    onSuccess: async ({ data }) => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.push(data.workspace.id);
    },
    onError: ({ message }) => {
      const messages = message.split(", ");
      messages.forEach((msg, index) =>
        setTimeout(() => {
          toast.error(msg || "An error occurred while creating workspace");
        }, index * 3000)
      );
    },
  });
  return mutation;
};
