"use client";
import CustomPasswordInput from "@/components/inputs/custom-password-input";
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
  resetPasswordFrontendSchema,
  ResetPasswordFrontendSchemaType,
} from "@/features/auth/validators/reset-password";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPasswordClient({ token }: { token: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<ResetPasswordFrontendSchemaType>({
    resolver: zodResolver(resetPasswordFrontendSchema),
    defaultValues: {
      token: token,
      newPassword: "",
      confirmPassword: "",
    },
  });
  const handleResetPassword = async (data: ResetPasswordFrontendSchemaType) => {
    await authClient.resetPassword({
      newPassword: data.newPassword,
      token: data.token,
      fetchOptions: {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          form.reset();
          toast.success("Password reset successfully");
          router.push("/sign-in");
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message || "Failed to reset password");
        },
      },
    });
  };
  return (
    <Card className="w-full md:w-[487px] px-2 py-4 space-y-4">
      <CardHeader className="flex items-center justify-center text-center p-0">
        <CardTitle className="text-2xl">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4 flex flex-col"
            onSubmit={form.handleSubmit(handleResetPassword)}
          >
            <CustomPasswordInput
              fieldTitle="New Password"
              nameInSchema="newPassword"
              placeHolder="Enter new password"
              className="h-12"
            />
            <CustomPasswordInput
              fieldTitle="Confirm Password"
              nameInSchema="confirmPassword"
              placeHolder="Confirm new password"
              className="h-12"
            />
            <Button
              type="submit"
              className="w-full h-12 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="mr-2 animate-spin" />
                  <p>Resetting...</p>
                </span>
              ) : (
                <p>Reset Password</p>
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
