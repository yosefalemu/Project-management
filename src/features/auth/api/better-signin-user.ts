import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api)["custom-auth"]["sign-in"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api)["custom-auth"]["sign-in"]["$post"]
>;

export const useBetterSigninUser = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api["custom-auth"]["sign-in"]["$post"]({
        json,
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to sign in");
      }
      const data = await response.json();
      return data;
    },
  });
  return mutation;
};
