import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetProjectProps {
  projectId: string | undefined;
}
export const useGetProject = ({ projectId }: UseGetProjectProps) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error("Workspace ID is required");
      }
      const response = await client.api.projects.single[":projectId"].$get({
        param: { projectId },
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
