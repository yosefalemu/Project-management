"use client";
import { useSearchParams } from "next/navigation";
import SignUpCard from "./sign-up-card";

export default function SignUpCardWrapper() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || undefined;
  return <SignUpCard redirectTo={redirectTo} />;
}
