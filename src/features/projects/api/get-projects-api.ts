import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetProjectsProps {
  workspaceId: string | undefined;
}
export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error("Workspace ID is required");
      }
      const response = await client.api.projects["user-projects"].$get({
        param: { workspaceId },
      });
      if (!response.ok) {
        throw new Error("An error occurred while fetching projects data");
      }
      const json = await response.json();
      if ("data" in json) {
        return json.data;
      } else {
        throw new Error(json.error || json.message || "Unknown error");
      }
    },
  });
  return query;
};
