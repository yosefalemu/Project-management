import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface GetProjectMemberProps {
  projectId: string;
  workspaceId: string;
}

export const useGetProjectMembers = ({
  projectId,
  workspaceId,
}: GetProjectMemberProps) => {
  const query = useQuery({
    queryKey: ["project-member", projectId, workspaceId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      const response = await client.api.projects["get-project-member"][
        ":projectId"
      ][":workspaceId"].$get({
        param: { projectId, workspaceId },
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching project members");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
