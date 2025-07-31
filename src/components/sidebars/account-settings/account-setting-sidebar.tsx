import { cn } from "@/lib/utils";

type AccountSettingProps = {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
};
export default function AccountSettingSidebar({
  currentTab,
  setCurrentTab,
}: AccountSettingProps) {
  const accountSettingItems = [
    { id: "account", label: "Account", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🔍" },
  ];
  return (
    <div>
      <ul className="space-y-0">
        {accountSettingItems.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex items-center gap-2 p-2 hover:bg-primary/10 cursor-pointer",
              currentTab === item.id
                ? "bg-primary/10 font-semibold"
                : "text-muted-foreground"
            )}
            onClick={() => setCurrentTab(item.id)}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
