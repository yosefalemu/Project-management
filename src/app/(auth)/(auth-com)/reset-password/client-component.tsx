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
import { useResetPassword } from "@/features/auth/api/reset-password";
import {
  resetPasswordFrontendSchema,
  ResetPasswordFrontendSchemaType,
} from "@/features/auth/validators/reset-password";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPasswordClient({ token }: { token: string }) {
  const router = useRouter();
  const resetPassword = useResetPassword();
  const form = useForm<ResetPasswordFrontendSchemaType>({
    resolver: zodResolver(resetPasswordFrontendSchema),
    defaultValues: {
      token: token,
      newPassword: "",
      confirmPassword: "",
    },
  });
  const handleResetPassword = (data: ResetPasswordFrontendSchemaType) => {
    const dataSend = {
      token: data.token,
      newPassword: data.newPassword,
    };
    resetPassword.mutate(
      {
        json: dataSend,
      },
      {
        onSuccess: () => {
          toast.success("Password reset successfully");
          form.reset();
          router.push("/sign-in");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to reset password");
        },
      }
    );
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
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending ? "Resetting..." : "Reset Password"}
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
