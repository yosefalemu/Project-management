import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import MemberAvatar from "@/features/members/components/member-avatar";

interface CustomSelectInputProps {
  fieldTitle: string;
  nameInSchema: string;
  placeHolder: string;
  className?: string;
  data?: { id: string; name: string; image?: string }[];
}
export default function CustomSelectInput({
  fieldTitle,
  nameInSchema,
  placeHolder,
  className,
  data,
}: CustomSelectInputProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => {
        return (
          <FormItem className={cn("", className)}>
            <FormLabel>{fieldTitle}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={placeHolder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="flex">
                {data?.map((item) => (
                  <SelectItem value={item.id} key={item.id} className="">
                    <div className="flex items-center gap-x-2">
                      <MemberAvatar
                        image={item.image}
                        name={item.name}
                        className="size-6 text-xs"
                      />
                      {item.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
