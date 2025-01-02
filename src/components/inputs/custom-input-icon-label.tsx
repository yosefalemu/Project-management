import { useFormContext } from "react-hook-form";
import { IconType } from "react-icons";
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
  icon: IconType;
}
export default function CustomInputIconWithLabel({
  icon: Icon,
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
              <div>
                <Input
                  id={nameInSchema}
                  className={cn(
                    "w-full max-w-xl disabled:cursor-not-allowed relative",
                    className
                  )}
                  placeholder={placeHolder}
                  {...props}
                  {...field}
                />
                <Icon />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
