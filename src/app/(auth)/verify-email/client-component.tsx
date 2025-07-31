"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  sendVerificationEmailSchema,
  SendVerificationEmailSchemaType,
} from "@/features/auth/validators/send-verification-email";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCallback } from "react";
import { Loader } from "lucide-react";

export default function VerifyEmailClient({ token }: { token: string }) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [data, setData] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyEmail = useCallback(async () => {
    await authClient.verifyEmail({
      query: {
        token,
      },
      fetchOptions: {
        onRequest: () => {
          setIsVerifying(true);
        },
        onSuccess: () => {
          setData(true);
          setIsVerifying(false);
          toast.success("Email verified successfully");
        },
        onError: ({ error }) => {
          console.error("Verification error:", error);
          setIsVerifying(false);
          setError(error.message || "Failed to verify email");
        },
      },
    });
  }, [token]);

  const sendVerificationEmail = async (
    data: SendVerificationEmailSchemaType
  ) => {
    await authClient.sendVerificationEmail({
      email: data.email,
      fetchOptions: {
        onRequest: () => {
          setIsSending(true);
        },
        onSuccess: () => {
          setIsSending(false);
          toast.success("Verification email sent successfully");
        },
        onError: ({ error }) => {
          setIsSending(false);
          toast.error(error.message || "Failed to send verification email");
        },
      },
    });
  };

  useEffect(() => {
    verifyEmail();
  }, [verifyEmail]);

  const form = useForm<SendVerificationEmailSchemaType>({
    resolver: zodResolver(sendVerificationEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Card className="w-[650px] p-8 h-fit flex items-stretch justify-center">
      {isVerifying || !(data || error) ? (
        <div className="flex flex-col items-center gap-y-4">
          <div className="relative h-32 w-32 bg-primary-foreground rounded-full p-2">
            <Image
              src="/images/logo.png"
              fill
              alt="Logo"
              className="object-cover"
            />
          </div>
          <div className="loader"></div>
        </div>
      ) : error === "token_expired" ? (
        <div className="flex flex-col items-center gap-y-4">
          <div className="relative h-32 w-32 bg-primary-foreground rounded-full p-2">
            <Image
              src="/images/logo.png"
              fill
              alt="Logo"
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold">Token Expired</h1>
          <h3 className="text-lg text-gray-600 text-center">
            The verification token expired. Please request a new verification
            email.
          </h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(sendVerificationEmail)}
              className="w-full space-y-4 items-center flex flex-col"
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      value={field.value}
                      className="h-12 w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-4 px-4 py-2 rounded text-xs w-full h-10"
              >
                {isSending ? (
                  <span className="flex items-center justify-center">
                    <Loader className="mr-2 animate-spin" />
                    <p>Sending...</p>
                  </span>
                ) : (
                  <p className="text-sm">Request New Verification Email</p>
                )}
              </Button>
            </form>
          </Form>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-y-4">
          <div className="relative h-32 w-32 bg-primary-foreground rounded-full p-2">
            <Image
              src="/images/logo.png"
              fill
              alt="Logo"
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold">
            {error === "invalid_token"
              ? "Invalid Verification Token"
              : "Verification Error"}
          </h1>
          <h3 className="text-lg text-gray-600 text-center">
            {error === "invalid_token"
              ? "The verification token is invalid. Please check your credintials or request a new verification email."
              : "An unexpected error occurred during verification. Please try again later."}
          </h3>
          <Button
            onClick={() => router.push("/sign-in")}
            className="p-4 bg-red-600 hover:bg-red-500 text-white rounded h-10"
          >
            Return to Sign In
          </Button>
        </div>
      ) : data ? (
        <div className="flex flex-col items-center gap-y-4">
          <div className="relative h-32 w-32 bg-primary-foreground rounded-full p-2">
            <Image
              src="/images/logo.png"
              fill
              alt="Logo"
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold">
            Email Verified Successfully
          </h1>
          <h3 className="text-lg text-gray-600">
            Your email has been verified. You can now access your account.
          </h3>
          <Button
            onClick={() => router.push("/sign-in")}
            className="mt-4 px-4 py-2 rounded"
          >
            Proceed to Sign In
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
