import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fontProfile } from "@/states/font/font-state";

type PreferenceContentsProps = {
  currentTab?: string;
};
export default function PreferenceContents({
  currentTab,
}: PreferenceContentsProps) {
  return (
    <div>
      {currentTab === "notifications" && <NotificationComponent />}
      {currentTab === "appearance" && <AppearanceComponent />}
      {currentTab === "account" && <AccountComponent />}
    </div>
  );
}

const NotificationComponent = () => {
  return <div>Notification Settings</div>;
};

const AppearanceComponent = () => {
  const fontOptions = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Nunito",
    "Source Sans Pro",
    "Raleway",
    "Ubuntu",
    "Merriweather",
    "Oswald",
    "Playfair Display",
    "PT Sans",
    "Fira Sans",
    "Noto Sans",
    "Droid Sans",
  ];
  const { setTheme } = useTheme();
  const { font, setFont } = fontProfile();

  return (
    <div className="flex flex-col space-y-4 h-full">
      <div className="flex flex-col gap-1">
        <h1>Font</h1>
        <div className="text-muted-foreground max-w-xs">
          <Select defaultValue={font} onValueChange={setFont}>
            <SelectTrigger>
              <SelectValue placeholder="Select Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fonts</SelectLabel>
                {fontOptions.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h1>Choose Mode</h1>
        <p className="text-muted-foreground max-w-xl text-sm">
          Choose if Slack’s appearance should be light or dark, or follow your
          computer’s settings.
        </p>
        <div className="flex items-center justify-between gap-x-4">
          <Button
            className="flex-1 flex items-center gap-x-2 px-4 py-2"
            variant="outline"
            onClick={() => {
              setTheme("light");
            }}
          >
            ☀️
            <p>Light</p>
          </Button>
          <Button
            className="flex-1 flex items-center gap-x-2 px-4 py-2"
            variant="outline"
            onClick={() => {
              setTheme("dark");
            }}
          >
            🌙
            <p>Dark</p>
          </Button>
          <Button
            className="flex-1 flex items-center gap-x-2 px-4 py-2"
            variant="outline"
            onClick={() => {
              setTheme("system");
            }}
          >
            🖥️
            <p>System</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

const AccountComponent = () => {
  return <div>Account Settings</div>;
};
