import { useState } from "react";
import type { JSX } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import ResponsiveModal from "@/components/responsive-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const useConfirm = (
  title: string,
  message: string,
  options: {
    variant?: ButtonProps["variant"];
    confirmLabel?: string;
    cancelLabel?: string;
  }
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };
  const handleConfirm = () => {
    if (promise) {
      promise.resolve(true);
      handleClose();
    }
  };

  const handleCancel = () => {
    if (promise) {
      promise.resolve(false);
      handleClose();
    }
  };

  const ConfirmationDialog = () => {
    return (
      <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
        <Card className="w-full h-full shadow-none border-none">
          <CardContent className="pt-8">
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full lg:w-auto"
              >
                {options.cancelLabel ?? "Cancel"}
              </Button>
              <Button
                onClick={handleConfirm}
                variant={options.variant ?? "default"}
                className="w-full lg:w-auto"
              >
                {options.confirmLabel ?? "Confirm"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </ResponsiveModal>
    );
  };
  return [ConfirmationDialog, confirm];
};
