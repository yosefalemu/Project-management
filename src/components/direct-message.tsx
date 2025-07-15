import WorkspaceAvatar from "@/features/workspace/components/workspace-avatar";
import DootedSeparator from "./dooted-separator";
import { Switch } from "./ui/switch";
import { formatDistanceToNow } from "date-fns";

export default function DirectMessage() {
  const users = [
    {
      id: "1",
      name: "Alice",
      image: "https://example.com/alice.jpg",
      message: "Hey there!",
      timestamp: "2025-07-15T09:32:00Z",
    },
    {
      id: "2",
      name: "Bob",
      image: "https://example.com/bob.jpg",
      message: "Hello!",
      timestamp: "2025-07-12T12:32:00Z",
    },
    {
      id: "3",
      name: "Charlie",
      image: "https://example.com/charlie.jpg",
      message: "How's it going?",
      timestamp: "2025-07-15T11:32:00Z",
    },
  ];
  return (
    <div className="p-4 min-w-[350px] flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Direct Messages</h2>
        <div className="flex items-center gap-2">
          <h1>Unread DMs</h1>
          <Switch />
        </div>
      </div>
      <DootedSeparator />
      <div className="flex flex-col">
        {users.map((user, index) => (
          <div key={user.id} className="flex items-center flex-col gap-2">
            <div className="flex items-center justify-between gap-2 w-full hover:bg-primary-foreground/15 p-2 rounded-md cursor-pointer">
              <div className="flex items-center gap-2">
                <WorkspaceAvatar name={user.name} className="size-10" />
                <div className="flex flex-col gap-1">
                  <h1 className="font-semibold text-sm">{user.name}</h1>
                  <p className="font-normal text-muted-foreground text-sm">
                    {user.message}
                  </p>
                </div>
              </div>
              <div className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(user.timestamp))}
              </div>
            </div>
            {index < users.length - 1 && <DootedSeparator className="mb-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}
