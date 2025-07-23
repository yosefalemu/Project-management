import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["update-user"]["$patch"]
>;

type RequestType = InferRequestType<
  (typeof client.api.auth)["update-user"]["$patch"]
>;

export const useBetterAuthUpdateUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["update-user"].$patch({ json });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          typeof errorData === "object" && "message" in errorData
            ? errorData.message
            : "Failed to update user";
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
  return mutation;
};
