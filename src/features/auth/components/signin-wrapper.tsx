"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SignInCard from "./sign-in-card";

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
