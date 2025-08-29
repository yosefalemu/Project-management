import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomInputLabel from "@/components/inputs/custom-input-label";
import DootedSeparator from "@/components/dooted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import CustomPasswordInput from "@/components/inputs/custom-password-input";
import Link from "next/link";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { loginUserSchema, LoginUserSchemaType } from "../validators/login";
import CustomCheckBox from "@/components/inputs/custom-checkbox";
import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

interface SignInCardProps {
  redirect?: string;
}
export default function SignInCard({ redirect }: SignInCardProps) {
  console.log("redirect in sign-in component", redirect);
  const [signInEmailLoading, setSignInEmailLoading] = useState<boolean>(false);
  const [signInGoogleLoading, setSignInGoogleLoading] =
    useState<boolean>(false);
  const [signInGithubLoading, setSignInGithubLoading] =
    useState<boolean>(false);
  const form = useForm<LoginUserSchemaType>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleLogin = async (data: LoginUserSchemaType) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
      callbackURL: redirect ?? "/",
      fetchOptions: {
        onRequest: () => {
          setSignInEmailLoading(true);
        },
        onSuccess: () => {
          setSignInEmailLoading(false);
          form.reset();
          toast.success("Logged in successfully");
        },
        onError: ({ error }) => {
          setSignInEmailLoading(false);
          toast.error(error.message || "Failed to log in");
        },
      },
    });
  };

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: redirect ?? "/",
      errorCallbackURL: "/sign-in",
      requestSignUp: true,
      fetchOptions: {
        onRequest: () => {
          setSignInGoogleLoading(true);
        },
        onSuccess: () => {
          setSignInGoogleLoading(false);
        },
        onError: ({ error }) => {
          setSignInGoogleLoading(false);
          toast.error(error.message || "Failed to log in with Google");
        },
      },
    });
  };
  const signInWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: redirect ?? "/",
      errorCallbackURL: "/sign-in",
      fetchOptions: {
        onRequest: () => {
          setSignInGithubLoading(true);
        },
        onSuccess: () => {
          setSignInGithubLoading(false);
        },
        onError: ({ error }) => {
          setSignInGithubLoading(false);
          toast.error(error.message || "Failed to log in with Github");
        },
      },
    });
  };

  return (
    <Card className="w-full h-full md:w-[487px] px-2 py-4 space-y-4">
      <CardHeader className="flex items-center justify-center text-center p-0">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(handleLogin)}>
            <CustomInputLabel
              fieldTitle="Email"
              nameInSchema="email"
              placeHolder="Enter email address"
            />
            <CustomPasswordInput
              fieldTitle="Password"
              nameInSchema="password"
              placeHolder="Enter password"
              className="h-12"
            />
            <CustomCheckBox
              nameInSchema="rememberMe"
              fieldTitle="Remember me"
            />
            <DootedSeparator className="py-2" />
            <Button
              type="submit"
              className="w-full h-12 cursor-pointer"
              disabled={
                signInEmailLoading || signInGoogleLoading || signInGithubLoading
              }
            >
              {signInEmailLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="mr-2 animate-spin" />
                  <p>Logging</p>
                </span>
              ) : (
                <p>Login</p>
              )}
            </Button>
          </form>
        </Form>
        <CardFooter className="w-full space-y-4 flex flex-col p-0">
          <Button
            type="button"
            onClick={signInWithGoogle}
            className="w-full cursor-pointer"
            size="xl"
            variant="secondary"
            disabled={
              signInGoogleLoading || signInEmailLoading || signInGithubLoading
            }
          >
            {signInGoogleLoading ? (
              <div className="flex items-center justify-center">
                <Loader className="mr-2 animate-spin" />
                <p>Logging in with Google</p>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FcGoogle className="mr-2" />
                Login with Google
              </div>
            )}
          </Button>
          <Button
            type="button"
            className="w-full cursor-pointer"
            size="xl"
            variant="secondary"
            onClick={signInWithGithub}
            disabled={
              signInGithubLoading || signInEmailLoading || signInGoogleLoading
            }
          >
            {signInGithubLoading ? (
              <div className="flex items-center justify-center">
                <Loader className="mr-2 animate-spin" />
                <p>Logging in with Github</p>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaGithub className="mr-2" />
                Login with Github
              </div>
            )}
          </Button>
          <div className="w-full text-sm flex items-center justify-center">
            Don&rsquo;t have an account
            <Link
              href={
                redirect !== undefined
                  ? `sign-up?redirect=${redirect}`
                  : "/sign-up"
              }
            >
              <span className="ml-2 text-blue-700 underline">Sign Up</span>
            </Link>
          </div>
          <Link href="/forgot-password">
            <span className="underline text-sm">Forget Password?</span>
          </Link>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
