"use client";
import ChannelTitle from "@/features/channels/components/channel-title";
import CreateMessage from "@/features/channels/components/create-message";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ChannelPage() {
  const params = useParams();
  const [text, setText] = useState("");
  const [textareaHeight, setTextareaHeight] = useState(40);

  useEffect(() => {
    const textarea = document.getElementById("message-input");
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 760);
      setTextareaHeight(newHeight);
    }
  }, [text]);

  const channelId = Array.isArray(params.channelId)
    ? (params.channelId[0] ?? "")
    : (params.channelId ?? "");

  console.log("Text area height", textareaHeight);

  return (
    <div className="w-full h-full flex flex-col">
      <ChannelTitle channelId={channelId} />
      <div
        className={cn(
          "flex-1 overflow-y-auto hide-scrollbar p-2",
          `h-[calc(100vh-4rem-${textareaHeight}px)]`
        )}
      >
        <div className="h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="p-2 border-b">
              Message {i + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="p-2 border-t">
        <CreateMessage
          channelId={channelId}
          value={text}
          onChange={(e) => setText(e.target.value)}
          height={textareaHeight}
          id="message-input"
        />
      </div>
    </div>
  );
}
