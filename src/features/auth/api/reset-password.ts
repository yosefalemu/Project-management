import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["reset-password"]["$post"]
>;

type RequestType = InferRequestType<
  (typeof client.api.auth)["reset-password"]["$post"]
>;

export const useResetPassword = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["reset-password"].$post({
        json,
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to reset password");
      }
      const data = await response.json();
      return data;
    },
  });
  return mutation;
};
