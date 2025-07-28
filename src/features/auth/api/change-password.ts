import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["change-password"]["$post"]
>;

type RequestType = InferRequestType<
  (typeof client.api.auth)["change-password"]["$post"]
>;

export const useChangePassword = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["change-password"].$post({
        json: {
          newPassword: json.newPassword,
          oldPassword: json.oldPassword,
        },
      });
      if (!response.ok) {
        const { message, error } = await response.json();
        console.error("Change Password Error:", error);
        throw new Error(message || "Failed to change password");
      }
      const data = await response.json();
      return data;
    },
  });
  return mutation;
};
