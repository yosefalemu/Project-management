"use client";

import CustomInputLabel from "@/components/inputs/custom-input-label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "@/features/auth/validators/forgot-password";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const handleForgotPassword = async (data: ForgotPasswordSchemaType) => {
    await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          form.reset();
          toast.success("Password reset email sent successfully");
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message || "Failed to send forgot password email");
        },
      },
    });
  };
  return (
    <Card className="w-full h-full md:w-[487px] px-2 py-4 space-y-4">
      <CardHeader className="flex items-center justify-center text-center p-0">
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4 flex flex-col"
            onSubmit={form.handleSubmit(handleForgotPassword)}
          >
            <CustomInputLabel
              fieldTitle="Email"
              nameInSchema="email"
              placeHolder="Enter email address"
            />
            <Button
              type="submit"
              className="w-full h-12 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="mr-2 animate-spin" />
                  <p>Sending...</p>
                </span>
              ) : (
                <p>Forgot Password</p>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="w-full text-sm flex items-center justify-center">
          Remembered your password?
          <Link href="/sign-in">
            <span className="ml-2 text-blue-700 underline">Sign In</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
