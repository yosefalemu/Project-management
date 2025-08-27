"use client";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
  console.log("channel id:", channelId);
  return (
    <Textarea
      id={id}
      value={value}
      style={{ whiteSpace: "pre-wrap" }}
      placeholder="Type a message..."
      className={cn("w-full border-t p-2 focus:outline-none hide-scrollbar")}
      onChange={onChange}
      rows={Math.ceil(height / 24)}
    />
  );
}
