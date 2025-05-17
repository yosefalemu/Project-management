import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type RequestType = InferRequestType<
  (typeof client.api.projects)["invite-project-member"]["$post"]
>;

type ResponseType = InferResponseType<
  (typeof client.api.projects)["invite-project-member"]["$post"]
>;

export const useAddProjectMemebr = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.projects["invite-project-member"][
        "$post"
      ]({ json });
      if (!response.ok) {
        const errorData = await response.json();
        console.log("ERROR WHILE ADDING PROJECT MEMBER", errorData);
      }
      return (await response.json()) as ResponseType;
    },
  });
  return mutation;
};
