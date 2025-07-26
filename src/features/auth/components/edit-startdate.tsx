"use client";
import { useForm } from "react-hook-form";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { useCreateStartDate } from "@/features/auth/api/create-start-date";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useUpateStartDate } from "@/features/auth/api/update-startdate";

type FormValues = {
  startDate: Date | null;
};
type EditStartDateProps = {
  startDatePrev: string | null;
};

export default function EditStartDate({ startDatePrev }: EditStartDateProps) {
  const params = useParams();
  const createStartDate = useCreateStartDate();
  const updateStartDate = useUpateStartDate();

  const form = useForm<FormValues>({
    defaultValues: {
      startDate: startDatePrev ? new Date(startDatePrev) : null,
    },
  });

  useEffect(() => {
    form.setValue("startDate", startDatePrev ? new Date(startDatePrev) : null);
  }, [startDatePrev, form]);

  const handleSubmit = (value: FormValues) => {
    if (!value.startDate) {
      form.setError("startDate", {
        type: "required",
        message: "Start date is required",
      });
      return;
    }
    if (value.startDate > new Date()) {
      form.setError("startDate", {
        type: "validate",
        message: "Start date cannot be in the future",
      });
    }
    if (!startDatePrev) {
      createStartDate.mutate(
        {
          workspaceId: params.workspaceId as string,
          startDate: value.startDate.toISOString(),
        },
        {
          onSuccess: () => {
            console.log("Start date created successfully");
          },
          onError: () => {
            console.error("Error creating start date");
          },
        }
      );
    } else {
      updateStartDate.mutate(
        {
          workspaceId: params.workspaceId as string,
          startDateSend: value.startDate.toISOString(),
        },
        {
          onSuccess: () => {
            console.log("Start date updated successfully");
          },
          onError: () => {
            console.error("Error updating start date");
          },
        }
      );
    }
  };
  return (
    <DialogContent>
      <DialogHeader className="border-b-2 pb-4">
        <DialogTitle>Edit Start Date</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="startDate"
            render={() => (
              <FormItem className="space-y-2 flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    placeHolder="Select start date"
                    value={form.watch("startDate")}
                    onChange={(date) => {
                      form.setValue("startDate", date);
                      form.clearErrors("startDate");
                    }}
                    className="h-12"
                    side="top"
                    popoverClassName="w-auto p-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-x-5 border-t-2 pt-4">
            <DialogClose asChild>
              <Button variant="ghost" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={!form.formState.isValid || createStartDate.isPending}
            >
              {createStartDate.isPending || updateStartDate.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
