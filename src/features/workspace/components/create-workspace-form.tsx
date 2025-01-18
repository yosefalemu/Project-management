import {
  createWorkspaceSchema,
  insertWorkspaceType,
} from "@/zod-schemas/workspace-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CreateWorkSpaceFormProps {
  onCancel: () => void;
}
export default function CreateWorkSpaceForm({
  onCancel,
}: CreateWorkSpaceFormProps) {
  const form = useForm<insertWorkspaceType>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      userId: "",
    },
  });

  const handleCreateWorkspace = (data: insertWorkspaceType) => {
    console.log("Values", data);
  };
  return <div>Test</div>;
}
