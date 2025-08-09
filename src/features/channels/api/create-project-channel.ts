import { useMutation } from "@tanstack/react-query";
import { createProjectChannelSchemaType } from "../validators/create-channel";
import { client } from "@/lib/rpc";

export const useCreateProjectChannel = () => {
  const mutation = useMutation({
    mutationKey: ["createProjectChannel"],
    mutationFn: async (data: createProjectChannelSchemaType) => {
      const response = await client.api.channels["create"].$post({
        json: data,
      });
      if (!response.ok) {
        throw new Error("An error occurred while creating the channel");
      }
      const { message } = await response.json();
      return message;
    },
  });

  return mutation;
};
