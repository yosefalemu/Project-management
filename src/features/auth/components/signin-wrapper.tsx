"use client";
import { useSearchParams } from "next/navigation";
import SignInCard from "@/features/auth/components/sign-in-card";

export default function SignInCardWrapper() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || undefined;
  return <SignInCard redirectTo={redirectTo} />;
}
