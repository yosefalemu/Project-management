import { client } from "@/lib/rpc";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ZodErrorDetail = {
  name: string;
  issues: { message: string }[];
};
type ErrorResponse = {
  error?: ZodErrorDetail | string;
  message?: string;
};

type ResponseType = InferResponseType<
  (typeof client.api.projects)["$patch"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.projects)["$patch"]>;
const queryClient = new QueryClient();
export const useUpdateProject = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects["$patch"]({ form });
      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        console.log("ERROR WHILE UPDATING WORKSPACES", errorData);
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
          errorData.message || "An error occurred while updating project"
        );
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
  return mutation;
};
