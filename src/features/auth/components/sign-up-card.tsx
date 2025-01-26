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
import { useRegister } from "../api/register-user-api";
import { insertUserSchema, insertUserType } from "@/zod-schemas/users-schema";
import { Loader } from "lucide-react";
import DisplayServerActionResponse from "@/components/DisplayServerActionResponse";

export default function SignUpCard() {
  const registerMutation = useRegister();
  const form = useForm<insertUserType>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const handleSignUp = (data: insertUserType) => {
    registerMutation.mutate({ json: data });
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none px-2 py-4 space-y-4">
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
        <DisplayServerActionResponse
          data={
            registerMutation.data
              ? { message: "User registered successfully" }
              : undefined
          }
          error={
            registerMutation.error
              ? { message: registerMutation.error.message }
              : undefined
          }
          onReset={() => registerMutation.reset()}
        />
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
              nameInSchema="confirm_password"
              className="h-12"
              placeHolder="Enter confirm password"
            />
            <DootedSeparator className="py-4" />
            <Button
              type="submit"
              className="w-full h-12 cursor-pointer"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
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
            <Link href="/sign-in">
              <span className="ml-2 text-blue-700 underline">Sign In</span>
            </Link>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
