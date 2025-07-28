"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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
import { insertUserSchema, insertUserType } from "@/zod-schemas/users-schema";
import { Loader } from "lucide-react";
import { useBetterAuthRegister } from "../api/better-signup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SignUpCardProps {
  redirectTo?: string;
}
export default function SignUpCard({ redirectTo }: SignUpCardProps) {
  const router = useRouter();
  const betterAuthRegisterMutation = useBetterAuthRegister();
  const form = useForm<insertUserType>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUp = (user: insertUserType) => {
    betterAuthRegisterMutation.mutate(
      {
        json: {
          name: user.name,
          email: user.email,
          password: user.password,
          confirmPassword: user.confirmPassword,
        },
      },
      {
        onSuccess: () => {
          toast.success("Successfully signed up and verification email sent");
          form.reset();
          router.push("/confirm-signup");
        },
        onError: (error) => {
          toast.error(error.message || "Sign up failed");
          console.error(
            "Sign up error:",
            error.cause,
            error.message,
            error.stack,
            error.name
          );
        },
      }
    );
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
              disabled={betterAuthRegisterMutation.isPending}
            >
              {betterAuthRegisterMutation.isPending ? (
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
        <CardFooter className="w-full space-y-4 flex flex-col p-0">
          <Button variant="secondary" className="h-12 w-full cursor-pointer">
            <FcGoogle className="mr-2" />
            Signup with google
          </Button>
          <Button variant="secondary" className="h-12 w-full cursor-pointer">
            <FaGithub className="mr-2" />
            Signup with github
          </Button>
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
