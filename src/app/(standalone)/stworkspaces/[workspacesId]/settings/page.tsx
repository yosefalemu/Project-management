import SettingComponent from "./_components/main";

export default async function SettingPage({
  params,
}: {
  params: Promise<{ workspacesId: string }>;
}) {
  const { workspacesId } = await params;

  return (
    <div className="w-full">
      <SettingComponent workspacesId={workspacesId} />
    </div>
  );
}
