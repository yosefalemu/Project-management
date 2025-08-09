import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.workspace)[":workspaceId"]["invite-code"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspace)[":workspaceId"]["invite-code"]["$patch"]
>;

type ErrorResponseType = InferResponseType<
  (typeof client.api.workspace)[":workspaceId"]["invite-code"]["$patch"],
  500
>;

export const useUpdateInviteCodeWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, ErrorResponseType, RequestType>({
    mutationFn: async ({ param }): Promise<ResponseType> => {
      const response = await client.api.workspace[":workspaceId"][
        "invite-code"
      ]["$patch"]({
        param,
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(
          message || "An error occurred while updating invite code"
        );
      }
      const data = await response.json();
      return data;
    },
    onSuccess: async ({ data }) => {
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      await queryClient.invalidateQueries({
        queryKey: ["workspace", { workspaceId: data.id }],
      });
    },
  });
  return mutation;
};
