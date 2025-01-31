"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useJoinWorkspace } from "../api/join-method-api";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

interface JoinWorkspaceFormProps {
  workspaceFound: { name: string; image?: string };
  workspaceId: string;
  invitecode: string;
}
export default function JoinWorkspaceForm({
  workspaceFound,
  workspaceId,
  invitecode,
}: JoinWorkspaceFormProps) {
  const router = useRouter();
  const { mutate, isPending, error } = useJoinWorkspace();
  const handleJoinWorkspace = () => {
    mutate(
      { json: { inviteCode: invitecode }, param: { workspaceId } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}`);
          toast.success(
            `You have successfully joined the ${workspaceFound.name}`
          );
        },
        onError: () => {
          toast.error(error ? error.message : "An error occured while joining");
        },
      }
    );
  };
  return (
    <Card className="w-full border-none shadow-none text-center">
      <CardHeader className="p-7">
        {workspaceFound.image && (
          <div className="flex justify-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={workspaceFound.image}
                alt={workspaceFound.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          <div className="flex flex-col gap-2">
            <p>
              You&apos;ve been invited to join{" "}
              <strong>{workspaceFound.name}</strong> workspace
            </p>
            <p>The invite link will be expires after 7 days</p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <Button
            variant="secondary"
            size="lg"
            type="button"
            className="w-full lg:w-1/2"
            onClick={() => router.push("/")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            className="w-full lg:w-1/2"
            onClick={handleJoinWorkspace}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center justify-center">
                <Loader className="mr-2 animate-spin" />
                <p>Joining</p>
              </span>
            ) : (
              <p>Join Workspace</p>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
