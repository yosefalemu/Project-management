import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api)["channel-messages"]["create"]["$post"],
  201
>;

type RequestType = InferRequestType<
  (typeof client.api)["channel-messages"]["create"]["$post"]
>;

type ZodError = {
  name: string;
  issues: { message: string }[];
};

type ErrorResponse = {
  error: string | ZodError;
  message: string;
};

export const useCreateChannelMessage = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, ErrorResponse, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api["channel-messages"]["create"].$post({
        json,
      });
      if (!response.ok) {
        const error = (await response.json()) as ErrorResponse;
        if (
          typeof error.error === "object" &&
          "name" in error.error &&
          error.error.name === "ZodError"
        ) {
          const validationErrors = error.error.issues.map((issue) => ({
            message: issue.message,
          }));
          throw new Error(validationErrors.map((e) => e.message).join(", "));
        }
        throw new Error(
          error.message || "An error occured while creating the channel message"
        );
      }
      const data = await response.json();
      return data;
    },
    onSuccess: async ({ data }) => {
      await queryClient.invalidateQueries({
        queryKey: ["channel-message", data.channelId],
      });
    },
    onError: ({ message }) => {
      const errorMessages = message.split(", ");
      errorMessages.forEach((msg, index) =>
        setTimeout(() => {
          toast.error(
            msg || "An error occurred while creating the channel message"
          );
        }, index * 3000)
      );
    },
  });
  return mutation;
};
