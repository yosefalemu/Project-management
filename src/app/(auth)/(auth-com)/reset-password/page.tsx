import { redirect } from "next/navigation";
import ResetPasswordClient from "./client-component";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const { token } = params;

  if (!token || token.trim() === "") {
    redirect("/sign-in");
  }

  return (
    <div className="h-full flex items-start justify-center">
      <ResetPasswordClient token={token} />
    </div>
  );
}
