import { client } from "@/lib/rpc";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.projects)["$post"],
  201
>;

type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;

type ZodError = {
  name: string;
  issues: { message: string }[];
};

type ErrorResponse = {
  error: ZodError | string;
  message?: string;
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.projects["$post"]({ json });
      if (!response.ok) {
        const error = (await response.json()) as ErrorResponse;
        if (
          typeof error.error === "object" &&
          "name" in error.error &&
          error.error.name === "ZodError"
        ) {
          const erroMessages = error.error.issues.map((issue) => issue.message);
          throw new Error(erroMessages.join(", "));
        }
        throw new Error(
          error.message || "An error occurred while creating project"
        );
      }
      const data = await response.json();
      return data;
    },
    onSuccess: async ({ data }) => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      await queryClient.invalidateQueries({
        queryKey: ["projects", data.project.id],
      });
    },
  });
  return mutation;
};
