import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetProjectsProps {
  workspaceId: string | undefined;
}
export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  const query = useQuery({
    queryKey: ["getProjects", workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error("Workspace ID is required");
      }
      const response = await client.api.projects[":workspaceId"].$get({
        param: { workspaceId },
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching projects data");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
