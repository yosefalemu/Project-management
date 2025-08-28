import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SlEarphonesAlt } from "react-icons/sl";

export default function ProjectHuddle() {
  return (
    <Tooltip>
      <TooltipTrigger asChild className="h-8">
        <Button className="h-8 rounded-sm" size="icon">
          <SlEarphonesAlt className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent
        align="end"
        side="bottom"
        className="tooltip-content min-w-96"
      >
        <div className="flex items-center flex-col bg-red-500">
          <span>Join Project Huddle</span>
          <p>hello</p>
          <p>world</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
