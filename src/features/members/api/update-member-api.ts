import { QueryClient, useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ZodErrorDetail = {
  name: string;
  issues: { message: string }[];
};
type ErrorResponse = {
  error?: ZodErrorDetail | string;
  message?: string;
};

// Ensure we're referencing the correct PATCH API route
type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$patch"],
  200
>;

type RequestType = {
  memberId: string;
  workspaceId: string;
  role: "member" | "admin" | "viewer";
};

const queryClient = new QueryClient();

export const useUpdateMember = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({
      memberId,
      workspaceId,
      role,
    }): Promise<ResponseType> => {
      const response = await client.api.members[":memberId"]["$patch"]({
        param: { memberId },
        json: { workspaceId, role },
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        console.log("ERROR WHILE UPDATING MEMBER ROLE", errorData);
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
          errorData.message ||
            "An error occurred while updating the member role"
        );
      }
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  return mutation;
};
