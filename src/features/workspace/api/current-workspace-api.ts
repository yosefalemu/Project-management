import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { insertWorkspaceType } from "@/zod-schemas/workspace-schema";

interface WorkspaceResponse {
  data: insertWorkspaceType[];
}

export const useCurrentGetWorkspace = (workspaceId: string | undefined) => {
  const query = useQuery({
    queryKey: ["currentWorkSpaces", workspaceId],
    queryFn: async (): Promise<insertWorkspaceType[]> => {
      if (!workspaceId) {
        throw new Error("Workspace ID is required");
      }
      const response = await client.api.workspace.current[":workspaceId"].$get({
        param: { workspaceId },
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching");
      }
      const { data } = (await response.json()) as unknown as WorkspaceResponse;
      return data;
    },
    enabled: !!workspaceId,
  });
  return query;
};
