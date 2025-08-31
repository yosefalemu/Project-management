import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)["update-task"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["update-task"]["$patch"]
>;
type ZodErrorDetail = {
  name: string;
  issues: { message: string }[];
};
type ErrorResponse = {
  error?: ZodErrorDetail | string;
  message?: string;
};
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["update-task"]["$patch"]({
        json,
      });
      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
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
          errorData.message || "An error occured while updating the task"
        );
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: async ({ data }) => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks", data.projectId],
      });
    },
  });
  return mutation;
};
