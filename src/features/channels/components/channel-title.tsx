import { Button } from "@/components/ui/button";
import { useGetChannel } from "../api/get-channel";
import { MoreVertical, User } from "lucide-react";
import ChannelAction from "./channel-action";
import { Skeleton } from "@/components/ui/skeleton";

interface ChannelTitleProps {
  channelId: string;
}
export default function ChannelTitle({ channelId }: ChannelTitleProps) {
  const {
    data: channelData,
    isLoading: isLoadingChannel,
    isError: isErrorChannel,
  } = useGetChannel({ channelId });
  if (isLoadingChannel || !channelData) {
    return (
      <div className="p-2 flex items-center justify-between">
        <Skeleton className="h-6 w-32 rounded-md" />
        <div className="flex items-center gap-x-1">
          <Skeleton className="h-8 w-12 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    );
  }

  if (isErrorChannel) return <h1>Error fetching channel</h1>;
  return (
    <div className="p-2 flex items-center justify-between border-b">
      <h1># {channelData.channel.name}</h1>
      <div className="flex items-center gap-x-1">
        <Button variant="outline" size="sm">
          <User />
          <p>{channelData.members.length}</p>
        </Button>
        <ChannelAction channelId={channelId}>
          <Button variant="ghost" size="sm" className="py-0 px-1">
            <MoreVertical className="cursor-pointer" />
          </Button>
        </ChannelAction>
      </div>
    </div>
  );
}
