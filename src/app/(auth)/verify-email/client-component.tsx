// app/verify-email/client-component.tsx
"use client";
import { useVerifyEmail } from "@/features/auth/api/verify-email";

export default function VerifyEmailClient({ token }: { token: string }) {
  const { data, isLoading, isError } = useVerifyEmail(token);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error verifying email. Please try again.</div>;
  }
  if (data) {
    return <div>Email verified successfully!</div>;
  }

  return <div>Verifying your email...</div>;
}
