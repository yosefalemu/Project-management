import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$delete"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$delete"],
  200
>;

type ZodError = {
  name: string;
  issues: { message: string }[];
};

type ErrorResponse = {
  error: ZodError | string;
  message: string;
};

export const useDeleteProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[":projectId"]["$delete"]({
        param,
      });
      if (!response.ok) {
        const { error, message } = (await response.json()) as ErrorResponse;
        console.log("ERROR WHILE DELETING PROJECT", { error, message });
        throw new Error(message || "An error occurred while deleting project");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
      router.push(`/${data.workspaceId}`);
      window.location.reload();
    },
  });
  return mutation;
};
