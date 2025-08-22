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
        const { error, message } = await response.json();
        console.log("Error fetching projects:", error, message);
        throw new Error(
          message || "An error occurred while fetching projects data"
        );
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
