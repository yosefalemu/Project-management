import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateStartDate = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (dataSend: {
      workspaceId: string;
      startDate: string;
    }) => {
      const response = await client.api.auth["create-start-date"].$post({
        json: {
          workspaceId: dataSend.workspaceId,
          startDate: dataSend.startDate,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create start date");
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
