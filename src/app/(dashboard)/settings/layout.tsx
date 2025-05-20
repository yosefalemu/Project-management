import ProjectSettingSidebar from "@/features/settings/components/project-setting-sidebar";

interface SettingLayoutProps {
  children: React.ReactNode;
}
export default function SettingLayout({ children }: SettingLayoutProps) {
  return (
    <div className="flex w-full h-full gap-x-2 relative">
      <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">
        <ProjectSettingSidebar />
      </div>
      <div className="lg:pl-[264px] w-full min-h-screen">
        <div className="max-w-screen-2xl h-full">
          <main className="h-full py-8 px-6 flex-col min-h-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
