"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function ChangeEmailComponent({ email }: { email: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <Card className="flex flex-col gap-y-8 p-16 items-center relative rounded-sm">
        <div className="flex flex-col items-center gap-y-2">
          <h1>Confirm your new email address</h1>
          <p className="text-muted-foreground">{email}</p>
          <h3>
            You&apos;re almost done! Please check your email for a confirmation
            link to change your email address.
          </h3>
          <p>Just click the link in the email to confirm your new email.</p>
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
