"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ConfirmSignUpComponent({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sendVerificationEmail = async () => {
    await authClient.sendVerificationEmail({
      email,
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Verification email sent successfully");
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message || "Failed to send verification email");
        },
      },
    });
  };
  return (
    <div className="h-full flex items-center justify-center">
      <Card className="flex flex-col gap-y-8 p-16 items-center relative rounded-sm">
        <div className="flex flex-col items-center gap-y-2">
          <h1>Please verify your email address</h1>
          <p className="text-muted-foreground">{email}</p>
          <h3>
            You are almost done! Please check your email for a verification
            link.
          </h3>
          <p>Just click the link in the email to verify your account.</p>{" "}
        </div>
        <div className="flex flex-col items-center gap-y-4">
          <p className="text-sm">
            If you didn&apos;t receive the email, check your spam folder.
          </p>
          <Button
            className="rounded-sm text-white min-w-52 bg-green-600 hover:bg-green-500"
            variant="outline"
            onClick={sendVerificationEmail}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader className="mr-2 animate-spin" />
                <p>Sending...</p>
              </span>
            ) : (
              <p>Resend Verification Email</p>
            )}
          </Button>
        </div>
        <div className="flex items-center">
          <h1 className="text-sm">Need help?</h1>
          <Link
            href="https://support.example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 underline text-sm"
          >
            Contact Support
          </Link>
        </div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-primary-foreground border">
            <Image src="/images/logo.png" fill alt="Logo" />
          </div>
        </div>
      </Card>
    </div>
  );
}
