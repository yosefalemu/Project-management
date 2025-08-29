"use client";
import { useSearchParams } from "next/navigation";
import SignUpCard from "./sign-up-card";
import { Suspense } from "react";

const SignUpCardWrapperComponent = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || undefined;
  return <SignUpCard redirect={redirect} />;
};
export default function SignUpCardWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpCardWrapperComponent />
    </Suspense>
  );
}
