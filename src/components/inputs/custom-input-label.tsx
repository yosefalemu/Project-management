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
  maxCharLength?: number;
}
export default function CustomInputLabel({
  fieldTitle,
  nameInSchema,
  placeHolder,
  className,
  maxCharLength,
  ...props
}: CustomInputLabelProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (
            maxCharLength === undefined ||
            e.target.value.length <= maxCharLength
          ) {
            field.onChange(e);
          }
        };
        return (
          <FormItem className={cn("", className)}>
            <FormLabel htmlFor={fieldTitle}>{fieldTitle}</FormLabel>
            <FormControl>
              <Input
                id={nameInSchema}
                className="w-full max-w-xl disabled:cursor-not-allowed h-12"
                placeholder={placeHolder}
                {...props}
                {...field}
                onChange={handleChange}
              />
            </FormControl>
            {maxCharLength && (
              <p className="text-xs text-neutral-500 max-w-xl text-right">
                {field.value.length}/{maxCharLength}
              </p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
