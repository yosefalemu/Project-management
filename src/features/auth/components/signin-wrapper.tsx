"use client";
import { useSearchParams } from "next/navigation";
import SignInCard from "@/features/auth/components/sign-in-card";
import { Suspense } from "react";

const SignInCardWrapperComponent = () => {
  const searchParams = useSearchParams();
  const redirects = searchParams.get("redirects") || undefined;
  return <SignInCard redirects={redirects} />;
};
export default function SignInCardWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInCardWrapperComponent />
    </Suspense>
  );
}
