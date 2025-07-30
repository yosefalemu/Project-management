"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import CustomInputLabel from "@/components/inputs/custom-input-label";
import DootedSeparator from "@/components/dooted-separator";
import { Button } from "@/components/ui/button";
import CustomPasswordInput from "@/components/inputs/custom-password-input";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { signupSchema, SignupSchemaType } from "../validators/signup";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SignUpCardProps {
  redirectTo?: string;
}
export default function SignUpCard({ redirectTo }: SignUpCardProps) {
  const router = useRouter();
  const [signUpLoading, setSignUpLoading] = useState<boolean>(false);
  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const handleSignUp = async (data: SignupSchemaType) => {
    await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/confirm-signup",
      fetchOptions: {
        onRequest: () => {
          setSignUpLoading(true);
        },
        onSuccess: ({ data }) => {
          console.log("Sign up successful:", data);
          setSignUpLoading(false);
          form.reset();
          router.push(`/confirm-signup/${data.user.email}`);
        },
        onError: ({ error }) => {
          toast.error(error.message || "Sign up failed");
          setSignUpLoading(false);
        },
      },
    });
  };

  return (
    <Card className="w-full h-full max-h-[570px] overflow-auto md:w-[487px]  hide-scrollbar px-2 py-4 space-y-4">
      <CardHeader className="flex items-center justify-center text-center p-0">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription className="text-sm">
          By signing up, you agree to our{" "}
          <Link
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-blue-700 underline cursor-pointer">
              privacy-policy
            </span>
          </Link>{" "}
          and{" "}
          <Link href="/terms" target="_blank" rel="noopener noreferrer">
            <span className="text-blue-700 underline cursor-pointer">
              terms
            </span>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            className="space-y-2"
            onSubmit={form.handleSubmit(handleSignUp)}
          >
            <CustomInputLabel
              fieldTitle="Name"
              nameInSchema="name"
              placeHolder="Enter your your name"
            />
            <CustomInputLabel
              fieldTitle="Email"
              nameInSchema="email"
              placeHolder="Enter email address"
            />
            <CustomPasswordInput
              fieldTitle="Password"
              nameInSchema="password"
              className="h-12"
              placeHolder="Enter password"
            />
            <CustomPasswordInput
              fieldTitle="Confirm Password"
              nameInSchema="confirmPassword"
              className="h-12"
              placeHolder="Enter confirm password"
            />
            <DootedSeparator className="py-4" />
            <Button
              type="submit"
              className="w-full h-12 cursor-pointer"
              disabled={signUpLoading}
            >
              {signUpLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="mr-2 animate-spin" />
                  <p>Signing Up</p>
                </span>
              ) : (
                <p>Sign Up</p>
              )}
            </Button>
          </form>
        </Form>
        <CardFooter className="w-full p-0">
          <div className="w-full text-sm flex items-center justify-center">
            Already have an account?
            <Link
              href={
                redirectTo ? `/sign-in?redirectTo=${redirectTo}` : "/sign-in"
              }
            >
              <span className="ml-2 text-blue-700 underline">Sign In</span>
            </Link>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
