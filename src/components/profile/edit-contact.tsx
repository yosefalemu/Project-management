import { useForm } from "react-hook-form";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import CustomInputLabel from "../inputs/custom-input-label";
import { Button } from "../ui/button";
import { updateUserSchema, updateUserType } from "@/zod-schemas/users-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBetterAuthUpdateUser } from "@/features/auth/api/better-update-user";

type EditContactInformationProps = {
  user: {
    id: string;
    name: string;
    email: string;
    password: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    phoneNumber: string | null;
  };
};
export default function EditContactInformation({
  user,
}: EditContactInformationProps) {
  const updateUserProfile = useBetterAuthUpdateUser();
  console.log("User data in EditContactInformation", user);
  const form = useForm<updateUserType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
    },
  });
  console.log("Form errors", form.formState.errors);

  const handleSubmit = (data: updateUserType) => {
    console.log("Form submitted", data);
    updateUserProfile.mutate(
      {
        json: {
          email: data.email,
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
          />
          <CustomInputLabel
            fieldTitle="Phone Number"
            nameInSchema="phoneNumber"
            placeHolder="Enter your phone number"
          />
          <Button type="submit" disabled={updateUserProfile.isPending}>
            {updateUserProfile.isPending
              ? "Updating..."
              : "Update Contact Info"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
