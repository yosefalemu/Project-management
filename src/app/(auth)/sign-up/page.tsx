"use client";
import { Suspense } from "react";
import SignUpCard from "@/features/auth/components/sign-up-card";
import SignUpCardWrapper from "@/features/auth/components/signup-wrapper";

const SignUpCardFallback = () => (
  <div className="h-full">
    <SignUpCard />
  </div>
);

export default function SignUpPage() {
  return (
    <div className="h-full">
      <Suspense fallback={<SignUpCardFallback />}>
        <SignUpCardWrapper />
      </Suspense>
    </div>
  );
}
