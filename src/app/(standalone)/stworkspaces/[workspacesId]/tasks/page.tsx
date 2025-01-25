import TaskComponent from "./_components/main";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ workspacesId: string }>;
}) {
  const { workspacesId } = await params;

  return (
    <div className="w-full">
      <TaskComponent workspacesId={workspacesId} />
    </div>
  );
}
