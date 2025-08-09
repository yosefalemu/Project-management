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

type ErrorResponse = InferResponseType<
  (typeof client.api.workspace)["$post"],
  500
>;

export const useCreateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
    mutationFn: async ({ form }): Promise<ResponseType> => {
      const response = await client.api.workspace["$post"]({ form });
      if (!response.ok) {
        const error = await response.json();
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
      toast.error(message || "An error occurred while creating workspace");
    },
  });
  return mutation;
};
