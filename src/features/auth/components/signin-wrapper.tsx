"use client";
import { useSearchParams } from "next/navigation";
import SignInCard from "@/features/auth/components/sign-in-card";
import { Suspense } from "react";

const SignInCardWrapperComponent = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || undefined;
  return <SignInCard redirectTo={redirectTo} />;
};
export default function SignInCardWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInCardWrapperComponent />
    </Suspense>
  );
}
