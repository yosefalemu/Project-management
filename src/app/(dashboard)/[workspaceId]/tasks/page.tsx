import TaskComponent from "@/features/tasks/components/task-component";

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
