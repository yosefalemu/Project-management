import { useFormContext } from "react-hook-form";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CustomInputLabelProps {
  fieldTitle: string;
  nameInSchema: string;
  placeHolder: string;
  className?: string;
}
export default function CustomPasswordInput({
  fieldTitle,
  nameInSchema,
  placeHolder,
  className,
  ...props
}: CustomInputLabelProps) {
  const form = useFormContext();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel htmlFor={fieldTitle}>{fieldTitle}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  id={nameInSchema}
                  className={cn(
                    "w-full max-w-xl disabled:cursor-not-allowed relative",
                    className
                  )}
                  placeholder={placeHolder}
                  type={passwordVisible ? "text" : "password"}
                  {...props}
                  {...field}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {passwordVisible ? (
                    <MdOutlineVisibilityOff
                      onClick={() => setPasswordVisible(false)}
                      className="text-xl cursor-pointer"
                    />
                  ) : (
                    <MdOutlineVisibility
                      onClick={() => setPasswordVisible(true)}
                      className="text-xl cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
