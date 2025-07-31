import MaximumSizeWrapper from "@/components/maximum-size-wrapper";
import ChangeEmailComponent from "@/features/auth/components/confirm-change-email";

type ConfirmChangeEmailPageProps = {
  params: Promise<{
    email: string;
  }>;
};
export default async function ConfirmChangeEmailPage({
  params,
}: ConfirmChangeEmailPageProps) {
  const { email } = await params;
  return (
    <MaximumSizeWrapper className="h-full">
      <ChangeEmailComponent email={decodeURIComponent(email)} />
    </MaximumSizeWrapper>
  );
}
