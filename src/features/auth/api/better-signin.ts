import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-in"]["email"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-in"]["email"]["$post"]
>;

export const useBetterAuthSignIn = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-in"].email.$post({ json });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to register");
      }
      const data = await response.json();
      return data;
    },
  });
  return mutation;
};
