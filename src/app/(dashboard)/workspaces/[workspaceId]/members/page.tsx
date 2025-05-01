import MembersList from "@/features/members/components/member-list";

export default function MemberPage() {
  return (
    <div className="w-full h-full flex flex-col items-start gap-x-2">
      <MembersList />
    </div>
  );
}
