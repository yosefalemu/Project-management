import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useVerifyEmail = (token: string) => {
  const query = useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: async () => {
      const response = await client.api.auth["verify-email"].$get({
        query: { token },
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to verify email.");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
