import { useState } from "react";
import type { JSX } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import ResponsiveModal from "@/components/responsive-modal";

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
      <ResponsiveModal
        open={promise !== null}
        onOpenChange={handleClose}
        className="sm:max-w-lg lg:max-w-xl"
      >
        <div className="w-full h-full shadow-none border-none">
          <h3>{title}</h3>
          <p>{message}</p>
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
        </div>
      </ResponsiveModal>
    );
  };
  return [ConfirmationDialog, confirm];
};
