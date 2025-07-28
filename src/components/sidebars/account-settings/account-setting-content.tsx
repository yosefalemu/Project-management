import CustomPasswordInput from "@/components/inputs/custom-password-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useChangePassword } from "@/features/auth/api/change-password";
import {
  ChangePasswordBackendSchemaType,
  changePasswordFrontendSchema,
  ChangePasswordFrontendSchemaType,
} from "@/features/auth/validators/change-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
      {currentTab === "security" && <SecurityTab />}
      {currentTab === "privacy" && <PrivacyTab />}
    </div>
  );
}

const SecurityTab = () => {
  const router = useRouter();
  const changePassword = useChangePassword();
  const form = useForm<ChangePasswordFrontendSchemaType>({
    resolver: zodResolver(changePasswordFrontendSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleChangePassword = (data: ChangePasswordFrontendSchemaType) => {
    const dataSend: ChangePasswordBackendSchemaType = {
      newPassword: data.newPassword,
      oldPassword: data.oldPassword,
    };
    changePassword.mutate(
      {
        json: dataSend,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          router.push("/sign-in");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to change password");
        },
      }
    );
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
              disabled={changePassword.isPending}
            >
              {changePassword.isPending ? "Changing..." : "Change Password"}
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
