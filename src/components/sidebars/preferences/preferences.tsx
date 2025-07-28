import { useState } from "react";
import PreferenceContents from "./preference-contents";
import PreferenceSidebar from "./preference-sidebar";

export default function Preferences() {
  const [currnetTab, setCurrentTab] = useState("notifications");
  return (
    <div className="flex">
      <div className="w-1/4 border-r">
        <PreferenceSidebar
          currentTab={currnetTab}
          setCurrentTab={setCurrentTab}
        />
      </div>
      <div className="flex-1 px-2 h-[520px] overflow-y-auto hide-scrollbar">
        <PreferenceContents currentTab={currnetTab} />
      </div>
    </div>
  );
}
