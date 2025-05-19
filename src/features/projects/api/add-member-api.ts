import { client } from "@/lib/rpc";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
  (typeof client.api.projects)["add-project-member"]["$post"]
>;

type ResponseType = InferResponseType<
  (typeof client.api.projects)["add-project-member"]["$post"]
>;

const queryClient = new QueryClient();
export const useAddProjectMemeber = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.projects["add-project-member"]["$post"](
        { json }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.log("ERROR WHILE ADDING PROJECT MEMBER", errorData);
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: (_data, variables) => {
      const { projectId, workspaceId } = variables.json;
      console.log("PROJECTID TO INVALIDATE", projectId);
      console.log("WORKSPACEID TO INVALIDATE", workspaceId);
      queryClient.invalidateQueries({
        queryKey: ["get-add-project-member", projectId, workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-member", projectId, workspaceId],
      });
    },
  });
  return mutation;
};
