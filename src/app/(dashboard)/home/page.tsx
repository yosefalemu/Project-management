"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/api/current";
import { useLogout } from "@/features/auth/api/logout";

export default function Home() {
  const router = useRouter();
  const { mutate } = useLogout();
  const { data, isLoading } = useCurrentUser();

  useEffect(() => {
    router.push("/sign-in");
  }, [data, isLoading, router]);

  return (
    <div>
      {!data ? (
        <div>Loading...</div>
      ) : (
        <p>
          FOR ONLY AUTHENTICATED USER
          <Button onClick={() => mutate}>Logout</Button>
        </p>
      )}
    </div>
  );
}
