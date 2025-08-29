"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SignInCard from "./sign-in-card";

const SignInCardWrapperComponent = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || undefined;
    return <SignInCard redirect={redirect} />;
};
export default function SignInCardWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInCardWrapperComponent />
    </Suspense>
  );
}
