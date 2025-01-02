import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface CustomInputLabelProps {
  fieldTitle: string;
  nameInSchema: string;
  placeHolder: string;
  className?: string;
}
export default function CustomInputLabel({
  fieldTitle,
  nameInSchema,
  placeHolder,
  className,
  ...props
}: CustomInputLabelProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel htmlFor={fieldTitle}>{fieldTitle}</FormLabel>
            <FormControl>
              <Input
                id={nameInSchema}
                className={cn(
                  "w-full max-w-xl disabled:cursor-not-allowed",
                  className
                )}
                placeholder={placeHolder}
                {...props}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
