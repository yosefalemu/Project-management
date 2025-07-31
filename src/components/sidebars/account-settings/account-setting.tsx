import * as React from "react";
import AccountSettingContent from "./account-setting-content";
import AccountSettingSidebar from "./account-setting-sidebar";

export default function AccountSetting() {
  const [currnetTab, setCurrentTab] = React.useState("account");
  return (
    <div className="flex">
      <div className="w-1/4 border-r">
        <AccountSettingSidebar
          currentTab={currnetTab}
          setCurrentTab={setCurrentTab}
        />
      </div>
      <div className="flex-1 p-4 h-[520px] overflow-y-auto hide-scrollbar">
        <AccountSettingContent currentTab={currnetTab} />
      </div>
    </div>
  );
}
