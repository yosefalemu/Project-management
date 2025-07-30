import MaximumSizeWrapper from "@/components/maximum-size-wrapper";
import ConfirmSignUpComponent from "@/features/auth/components/confirm-signup-component";

type ConfirmSignUpPageProps = {
  params: Promise<{
    email: string;
  }>;
};
export default async function ConfirmSignUpPage({
  params,
}: ConfirmSignUpPageProps) {
  const { email } = await params;
  return (
    <MaximumSizeWrapper className="h-full">
      <ConfirmSignUpComponent email={decodeURIComponent(email)} />
    </MaximumSizeWrapper>
  );
}
