// app/verify-email/page.tsx
import { redirect } from "next/navigation";
import VerifyEmailClient from "./client-component";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  const { token } = params;

  if (!token || token.trim() === "") {
    console.log("No valid token found, redirecting to /sign-in");
    redirect("/sign-in");
  }

  return (
    <div className="bg-red-400">
      <VerifyEmailClient token={token} />
    </div>
  );
}
