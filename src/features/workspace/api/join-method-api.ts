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
  (typeof client.api.workspace)[":workspaceId"]["join"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspace)[":workspaceId"]["join"]["$post"]
>;

const queryClient = new QueryClient();
export const useJoinWorkspace = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.workspace[":workspaceId"]["join"][
        "$post"
      ]({
        param: { workspaceId: param.workspaceId },
        json: { inviteCode: json.inviteCode },
      });
      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        console.log("ERROR WHILE JOINING MEMBERS", errorData);
        if (
          typeof errorData.error === "object" &&
          "name" in errorData.error &&
          errorData.error.name === "ZodError"
        ) {
          const errorDetail =
            errorData.error.issues[0]?.message || "Validation error occurred";
          throw new Error(errorDetail);
        }
        throw new Error(
          errorData.message || "An error occured while joining workspace"
        );
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
  return mutation;
};
