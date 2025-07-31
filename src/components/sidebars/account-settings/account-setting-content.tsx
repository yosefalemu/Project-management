import CustomInputLabel from "@/components/inputs/custom-input-label";
import CustomPasswordInput from "@/components/inputs/custom-password-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  changePasswordFrontendSchema,
  ChangePasswordFrontendSchemaType,
} from "@/features/auth/validators/change-password";
import {
  updateUserEmailSchema,
  updateUserEmailSchemaType,
} from "@/features/auth/validators/update-user";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type AccountSettingContentProps = {
  currentTab: string;
};
export default function AccountSettingContent({
  currentTab,
}: AccountSettingContentProps) {
  return (
    <div>
      {currentTab === "account" && <AccountTab />}
      {currentTab === "security" && <SecurityTab />}
      {currentTab === "privacy" && <PrivacyTab />}
    </div>
  );
}

const AccountTab = () => {
  const router = useRouter();
  const [isChangingEmail, setIsChangingEmail] = useState<boolean>(false);

  const { data: user, isPending, error } = authClient.useSession();

  const changeEmailForm = useForm<updateUserEmailSchemaType>({
    resolver: zodResolver(updateUserEmailSchema),
    defaultValues: {
      email: user?.user?.email ?? "",
    },
  });
  const handleEmailChange = (data: updateUserEmailSchemaType) => {
    if (data.email === user?.user?.email) {
      toast.error("New email cannot be the same as the current email.");
      return;
    }
    authClient.changeEmail({
      newEmail: data.email,
      callbackURL: "/dashboard",
      fetchOptions: {
        onRequest: () => {
          setIsChangingEmail(true);
        },
        onSuccess: () => {
          setIsChangingEmail(false);
          toast.success("Verification email sent.");
          router.push(`/confirm-change-email/${user?.user?.email}`);
        },
        onError: ({ error }) => {
          setIsChangingEmail(false);
          toast.error(error.message || "Failed to change email");
        },
      },
    });
  };

  useEffect(() => {
    changeEmailForm.setValue("email", user?.user?.email ?? "");
  }, [user, changeEmailForm]);

  if (isPending || !user) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }
  if (error) {
    return <p>Error loading user data: {error.message}</p>;
  }

  return (
    <Form {...changeEmailForm}>
      <form
        onSubmit={changeEmailForm.handleSubmit(handleEmailChange)}
        className="space-y-4"
      >
        <CustomInputLabel
          fieldTitle="Change Email Address"
          nameInSchema="email"
          placeHolder="Enter your email"
          className="w-full max-w-full"
        />
        <Button
          type="submit"
          disabled={isChangingEmail || isPending}
          className="h-12 w-full"
        >
          {isChangingEmail ? (
            <span className="flex items-center justify-center">
              <Loader className="mr-2 animate-spin" />
              <p>Changing...</p>
            </span>
          ) : (
            <p>Change Email Address</p>
          )}
        </Button>
      </form>
    </Form>
  );
};

const SecurityTab = () => {
  const router = useRouter();
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const form = useForm<ChangePasswordFrontendSchemaType>({
    resolver: zodResolver(changePasswordFrontendSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleChangePassword = async (
    data: ChangePasswordFrontendSchemaType
  ) => {
    await authClient.changePassword({
      currentPassword: data.oldPassword,
      newPassword: data.newPassword,
      fetchOptions: {
        onRequest: () => {
          setIsChangingPassword(true);
        },
        onSuccess: () => {
          setIsChangingPassword(false);
          form.reset();
          toast.success("Password changed successfully");
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/sign-in");
              },
            },
          });
        },
        onError: ({ error }) => {
          setIsChangingPassword(false);
          toast.error(error.message || "Failed to change password");
        },
      },
    });
  };
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <h1>Change Password</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleChangePassword)}
            className="flex flex-col gap-y-2"
          >
            <CustomPasswordInput
              fieldTitle="Old Password"
              nameInSchema="oldPassword"
              placeHolder="Enter old password"
              className="h-12"
            />
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
              className="h-12"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <span className="flex items-center justify-center">
                  <Loader className="mr-2 animate-spin" />
                  <p>Changing...</p>
                </span>
              ) : (
                <p>Change Password</p>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

const PrivacyTab = () => {
  return <div>Privacy Tab</div>;
};
