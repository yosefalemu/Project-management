export default function TaskComponent({
  workspacesId,
}: {
  workspacesId: string;
}) {
  return (
    <div className="w-full flex flex-col items-start gap-x-2">
      workspacesId: {workspacesId}
    </div>
  );
}
