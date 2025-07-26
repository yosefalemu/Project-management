import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Checkbox } from "../ui/checkbox";

interface CustomCheckBoxProps {
  nameInSchema: string;
  fieldTitle: string;
}
export default function CustomCheckBox({
  nameInSchema,
  fieldTitle,
  ...props
}: CustomCheckBoxProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => {
        return (
          <FormItem>
            <div className="flex items-center justify-start gap-x-2 w-fit">
              <FormControl>
                <Checkbox {...props} {...field} />
              </FormControl>
              <FormLabel>{fieldTitle}</FormLabel>
            </div>
          </FormItem>
        );
      }}
    />
  );
}
