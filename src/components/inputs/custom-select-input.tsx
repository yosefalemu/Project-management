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
import { Skeleton } from "../ui/skeleton";

interface CustomSelectInputProps {
  fieldTitle: string;
  nameInSchema: string;
  placeHolder: string;
  className?: string;
  data?: { id: string; name: string; image?: string }[];
  isFetchingData?: boolean;
}
export default function CustomSelectInput({
  fieldTitle,
  nameInSchema,
  placeHolder,
  className,
  data,
  isFetchingData,
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
                {isFetchingData ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        className="h-8 w-full flex items-center gap-x-8 pl-4 pr-2"
                      >
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-6 flex-1" />
                      </Skeleton>
                    ))}
                  </div>
                ) : (
                  data?.map((item) => (
                    <SelectItem value={item.id} key={item.id} className="">
                      <div className="flex items-center gap-x-2">
                        {item.image ? (
                          <MemberAvatar
                            image={item.image}
                            name={item.name}
                            className="size-6 text-xs"
                          />
                        ) : (
                          <MemberAvatar
                            name={item.name}
                            className="size-6 text-xs"
                          />
                        )}
                        {item.name}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
