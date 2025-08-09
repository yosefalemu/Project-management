import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspace)["workspace"]["join"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspace)["workspace"]["join"]["$post"]
>;

type ErrorResponseType = InferResponseType<
  (typeof client.api.workspace)["workspace"]["join"]["$post"],
  500
>;

export const useJoinWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, ErrorResponseType, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.workspace["workspace"]["join"]["$post"](
        {
          json: {
            inviteCode: json.inviteCode,
            workspaceId: json.workspaceId,
          },
        }
      );
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to join workspace");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.push(`/${data.newWorkspaceMember.workspaceId}`);
    },
    onError: ({ message }) => {
      toast.error(message || "Failed to join workspace");
    },
  });
  return mutation;
};
