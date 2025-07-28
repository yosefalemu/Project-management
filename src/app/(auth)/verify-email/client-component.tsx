"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSendVerificationEmail } from "@/features/auth/api/send-verification-email";
import { useVerifyEmail } from "@/features/auth/api/verify-email";
import {
  sendVerificationEmailSchema,
  SendVerificationEmailSchemaType,
} from "@/features/auth/validators/send-verification-email";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function VerifyEmailClient({ token }: { token: string }) {
  const router = useRouter();
  const { data, isLoading, error } = useVerifyEmail(token);
  const sendVerificationEmail = useSendVerificationEmail();

  const form = useForm<SendVerificationEmailSchemaType>({
    resolver: zodResolver(sendVerificationEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleResendEmail = (data: SendVerificationEmailSchemaType) => {
    sendVerificationEmail.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          toast.success("Verification email sent successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to send verification email");
        },
      }
    );
  };

  return (
    <Card className="w-[650px] p-8 h-fit flex items-stretch justify-center">
      {isLoading ? (
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
      ) : error && error.message === "token_expired" ? (
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
              onSubmit={form.handleSubmit(handleResendEmail)}
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
              <Button type="submit" className="mt-4 px-4 py-2 rounded text-xs w-full h-10">
                {sendVerificationEmail.isPending
                  ? "Sending..."
                  : "Request New Verification Email"}
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
            {error.message === "invalid_token"
              ? "Invalid Verification Token"
              : "Verification Error"}
          </h1>
          <h3 className="text-lg text-gray-600 text-center">
            {error.message === "invalid_token"
              ? "The verification token is invalid. Please check your credintials or request a new verification email."
              : "An unexpected error occurred during verification. Please try again later."}
          </h3>
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
      ) : (
        <div className="flex flex-col items-center gap-y-4">
          <div className="relative h-32 w-32 bg-primary-foreground rounded-full p-2">
            <Image
              src="/images/logo.png"
              fill
              alt="Logo"
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold">Unable to Process Request</h1>
          <h3 className="text-lg text-gray-600">
            An unexpected issue occurred. Please try again later or contact
            support.
          </h3>
          <Button
            onClick={() => router.push("/sign-in")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            Return to Sign In
          </Button>
        </div>
      )}
    </Card>
  );
}
