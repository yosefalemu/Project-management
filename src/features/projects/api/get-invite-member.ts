import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetInviteMember {
  projectId: string | undefined;
  workspaceId: string | undefined;
}

export const useGetInviteMember = ({
  projectId,
  workspaceId,
}: UseGetInviteMember) => {
  const query = useQuery({
    queryKey: ["invite-project-member", projectId, workspaceId],
    queryFn: async () => {
      if (!projectId || !workspaceId) {
        throw new Error("Project ID and Workspace ID are required");
      }
      const response = await client.api.projects["invite-project-member"][
        ":projectId"
      ][":workspaceId"].$get({ param: { projectId, workspaceId } });
      if (!response.ok) {
        throw new Error("Failed to fetch project members");
      }
      const { data } = await response.json();
      return data;
    },
    enabled: !!projectId && !!workspaceId,
  });
  return query;
};
