"use client";
import { useGetAllChannels } from "@/features/channels/api/get-all-channels";

export default function TopMain() {
  const { data: channels } = useGetAllChannels();
  console.log("Channels in TopMain:", channels);

  return <div>TOP MAIN</div>;
}
