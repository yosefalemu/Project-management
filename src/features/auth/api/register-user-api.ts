import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

// Define the expected error response structure
type ZodErrorDetail = {
  name: string;
  issues: { message: string }[];
};

type ErrorResponse = {
  error?: ZodErrorDetail | string;
  message?: string;
  data?: {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
  };
};

type ResponseType = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>;
type RequestType = InferRequestType<(typeof client.api.auth.register)["$post"]>;

export const useRegister = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register["$post"]({ json });
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
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
          errorData.message || "An error occurred while registering"
        );
      }

      const data: ResponseType = await response.json();
      return data;
    },
  });
  return mutation;
};
