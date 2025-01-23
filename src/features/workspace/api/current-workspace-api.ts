import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useCurrentGetWorkspace = () => {
  const query = useQuery({
    queryKey: ["currentWorkSpaces"],
    queryFn: async () => {
      const response = await client.api.workspace.current["$get"]();
      if (!response.ok) {
        throw new Error("An error occurred while fetching");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
