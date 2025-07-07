"use client"; 
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function NotFoundContent() {
  const searchParams = useSearchParams();
  const param = searchParams.get("someParam");

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Parameter: {param}</p>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}