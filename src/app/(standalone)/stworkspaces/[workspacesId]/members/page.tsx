import MembersComponent from "./_components/main";

export default async function MemberPage({
  params,
}: {
  params: Promise<{ workspacesId: string }>;
}) {
  const { workspacesId } = await params;

  return (
    <div className="w-full">
      <MembersComponent workspacesId={workspacesId} />
    </div>
  );
}
