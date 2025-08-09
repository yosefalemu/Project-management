import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetUserWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspace["user-workspaces"]["$get"]();
      console.log("Response from getUserWorkspaces:", response);
      if (!response.ok) {
        throw new Error("An error occurred while fetching workspaces");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
