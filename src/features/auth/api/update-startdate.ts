import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpateStartDate = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (dataSend: {
      workspaceId: string;
      startDateSend: string;
    }) => {
      const response = await client.api["custom-auth"][
        "update-start-date"
      ].$patch({
        json: {
          workspaceId: dataSend.workspaceId,
          startDateSend: dataSend.startDateSend,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to update start date");
      }
      const { data } = await response.json();
      return data;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["startDate", variables.workspaceId],
      });
    },
  });
  return mutation;
};
