import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ZodErrorDetail = {
  name: string;
  issues: { message: string }[];
};
type ErrorResponse = {
  error?: ZodErrorDetail | string;
  message?: string;
};

type ResponseType = InferResponseType<
  (typeof client.api.workspace)[":workspaceId"]["invite-code"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspace)[":workspaceId"]["invite-code"]["$patch"]
>;

export const useUpdateInviteCodeWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }): Promise<ResponseType> => {
      const response = await client.api.workspace[":workspaceId"][
        "invite-code"
      ]["$patch"]({
        param,
      });
      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        console.log("ERROR WHILE UPDATING INVITECODE", errorData);
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
          errorData.message || "An error occurred while updating invite code"
        );
      }
      return (await response.json()) as ResponseType;
    },
    onSettled: async (_, error, variables) => {
      if (error) {
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      await queryClient.invalidateQueries({
        queryKey: ["workspace", { workspaceId: variables.param.workspaceId }],
      });
    },
  });
  return mutation;
};
