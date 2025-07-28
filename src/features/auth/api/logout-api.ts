import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ErrorResponse = {
  error?: string;
  message?: string;
};

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = new QueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout["$post"]();
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(
          errorData.message || "An error occurred while logging out"
        );
      }
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      router.push("/sign-in");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });
  return mutation;
};
