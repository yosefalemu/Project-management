import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type ErrorResponse = {
  error?: string;
  message?: string;
};

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout["$post"]();
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(
          errorData.message || "An error occurred while logging out"
        );
      }
      return await response.json();
    },
  });
  return mutation;
};
