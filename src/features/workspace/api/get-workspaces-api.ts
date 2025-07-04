import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const getWorkspaces = async () => {
  const response = await client.api.workspace["$get"]();
  console.log("Response from getWorkspaces:", response);
  if (!response.ok) {
    throw new Error("An error occurred while fetching workspaces");
  }
  const { data } = await response.json();
  return data;
};
export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });
  return query;
};
