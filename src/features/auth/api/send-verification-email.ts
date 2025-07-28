import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";

export const useSendVerificationEmail = () => {
  const mutation = useMutation({
    mutationFn: async (dataSend: { email: string }) => {
      const response = await client.api.auth["send-verification-email"].$post({
        json: {
          email: dataSend.email,
        },
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Failed to send verification email");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return mutation;
};
