import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
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
import { useBetterAuthSignIn } from "../api/better-signin";
import {
  loginUserSchema,
  LoginUserSchemaType,
} from "../validators/login-validators";
import CustomCheckBox from "@/components/inputs/custom-checkbox";
import { useRouter } from "next/navigation";

interface SignInCardProps {
  redirects?: string;
}
export default function SignInCard({ redirects }: SignInCardProps) {
  console.log("SignInCard rendered with redirectTo:", redirects);
  const router = useRouter();
  const betterAuthSignInMutation = useBetterAuthSignIn();
  const form = useForm<LoginUserSchemaType>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  console.log("form values", form.getValues());
  console.log("form errors", form.formState.errors);

  const handleLogin = (data: LoginUserSchemaType) => {
    betterAuthSignInMutation.mutate(
      { json: data },
      {
        onSuccess: () => {
          toast.success("Logged in successfully");
          if (redirects) {
            router.push(redirects);
          } else {
            router.push("/");
          }
        },
        onError: (error) => {
          toast.error(error.message || "Login failed");
        },
      }
    );
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none px-2 py-4 space-y-4">
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
              disabled={betterAuthSignInMutation.isPending}
            >
              {betterAuthSignInMutation.isPending ? (
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
            className="w-full cursor-pointer"
            size="xl"
            variant="secondary"
          >
            <FcGoogle className="mr-2" />
            Login with Google
          </Button>
          <Button
            type="button"
            className="w-full cursor-pointer"
            size="xl"
            variant="secondary"
          >
            <FaGithub
              className="mr-2 
          "
            />
            Login with Github
          </Button>
          <div className="w-full text-sm flex items-center justify-center">
            Don&rsquo;t have an account
            <Link
              href={
                redirects !== undefined
                  ? `sign-up?redirects=${redirects}`
                  : "/sign-up"
              }
            >
              <span className="ml-2 text-blue-700 underline">Sign Up</span>
            </Link>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
