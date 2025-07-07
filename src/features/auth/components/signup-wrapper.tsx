"use client";
import { useSearchParams } from "next/navigation";
import SignUpCard from "./sign-up-card";
import { Suspense } from "react";

const SignUpCardWrapperComponent = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || undefined;
  return <SignUpCard redirectTo={redirectTo} />;
};
export default function SignUpCardWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpCardWrapperComponent />
    </Suspense>
  );
}
