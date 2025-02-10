import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { QueryClient } from "@tanstack/react-query";

type ZodErrorDetail = {
  name: string;
  issues: { message: string }[];
};
type ErrorResponse = {
  error?: ZodErrorDetail | string;
  message?: string;
};
const queryClient = new QueryClient();
type ResponseType = InferResponseType<(typeof client.api.tasks)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>;

export const useCreateTask = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }): Promise<ResponseType> => {
      const response = await client.api.tasks["$post"]({ json });
      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        console.log("ERROR WHILE CREATING TASK", errorData);
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
          errorData.message || "An error occurred while creating task"
        );
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getTasks"] });
    },
  });
  return mutation;
};
