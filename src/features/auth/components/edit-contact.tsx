import { useForm } from "react-hook-form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Form } from "../../../components/ui/form";
import CustomInputLabel from "../../../components/inputs/custom-input-label";
import { Button } from "../../../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBetterAuthUpdateUser } from "@/features/auth/api/better-update-user";
import {
  updateUserInfoSchema,
  updateUserInfoSchemaType,
} from "@/features/auth/validators/update-user";
import { toast } from "sonner";
import { Loader } from "lucide-react";

type EditContactInformationProps = {
  email: string;
  phoneNumber: string | null;
};
export default function EditContactInformation({
  email,
  phoneNumber,
}: EditContactInformationProps) {
  const updateUserProfile = useBetterAuthUpdateUser();
  const form = useForm<updateUserInfoSchemaType>({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues: {
      email: email ?? "",
      phoneNumber: phoneNumber ?? "",
    },
  });

  const handleSubmit = (data: updateUserInfoSchemaType) => {
    // TODO:: IT SHOULD BE OPTIONAL BUT FOR NOW IT IS REQUIRED
    if (!data.phoneNumber) {
      toast.error("Phone number is required");
      return;
    }
    updateUserProfile.mutate(
      {
        json: {
          phoneNumber: data.phoneNumber,
        },
      },
      {
        onSuccess: () => {
          console.log("User updated successfully");
        },
        onError: (error) => {
          console.error("Error updating user", error);
        },
      }
    );
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Contact Information</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <CustomInputLabel
            fieldTitle="Email"
            nameInSchema="email"
            placeHolder="Enter your email"
            disabled={true}
          />
          <CustomInputLabel
            fieldTitle="Phone Number"
            nameInSchema="phoneNumber"
            placeHolder="Enter your phone number"
          />
          <Button type="submit" disabled={updateUserProfile.isPending}>
            {updateUserProfile.isPending ? (
              <span className="flex items-center justify-center">
                <Loader className="mr-2 animate-spin" />
                <p>Saving...</p>
              </span>
            ) : (
              <p>Save Changes</p>
            )}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
