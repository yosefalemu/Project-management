"use client";
import { Suspense } from "react";
import SignInCard from "@/features/auth/components/sign-in-card";
import SignInCardWrapper from "@/features/auth/components/signin-wrapper";

const SignInCardFallback = () => (
  <div className="h-full">
    <SignInCard />
  </div>
);

export default function SignUpPage() {
  return (
    <div className="h-full">
      <Suspense fallback={<SignInCardFallback />}>
        <SignInCardWrapper />
      </Suspense>
    </div>
  );
}
