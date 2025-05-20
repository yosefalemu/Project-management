import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
  (typeof client.api.projects)["add-project-member"]["$post"]
>;

type ResponseType = InferResponseType<
  (typeof client.api.projects)["add-project-member"]["$post"]
>;

export const useAddProjectMember = () => {
  const queryClient = useQueryClient();
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
    onSuccess: async (_data, variables) => {
      const { projectId, workspaceId } = variables.json;
      await queryClient.invalidateQueries({
        queryKey: ["get-add-project-member", projectId, workspaceId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["project-member", projectId, workspaceId],
      });
    },
  });
  return mutation;
};
