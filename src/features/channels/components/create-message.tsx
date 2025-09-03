"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateChannelMessage } from "@/features/channel-messges/api/create-channel-message";
import { cn } from "@/lib/utils";
import { SendHorizontal } from "lucide-react";

interface CreateMessageProps {
  channelId: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  height: number;
  id: string;
}

export default function CreateMessage({
  channelId,
  value,
  onChange,
  height,
  id,
}: CreateMessageProps) {
  const createChannelMessage = useCreateChannelMessage();
  const createChannelMessageFunction = () => {
    createChannelMessage.mutate(
      {
        json: {
          channelId,
          content: value,
        },
      },
      {
        onSuccess: () => {
          onChange({
            ...({} as React.ChangeEvent<HTMLTextAreaElement>),
            target: {
              ...({} as HTMLTextAreaElement),
              value: "",
            },
          });
        },
      }
    );
  };

  return (
    <div className="w-full flex items-end gap-1">
      <Textarea
        id={id}
        value={value}
        style={{ whiteSpace: "pre-wrap" }}
        placeholder="Type a message..."
        className={cn("w-full border-t p-2 focus:outline-none hide-scrollbar")}
        onChange={onChange}
        rows={Math.ceil(height / 24)}
      />
      <Button
        size="icon"
        className="mt-2 float-right"
        disabled={!value || createChannelMessage.isPending}
        onClick={createChannelMessageFunction}
      >
        <SendHorizontal />
      </Button>
    </div>
  );
}
