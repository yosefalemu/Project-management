import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProjectHuddle() {
  return (
    <Tooltip>
      <TooltipTrigger asChild className="h-8">
        <Button>Hello</Button>
      </TooltipTrigger>
      <TooltipContent align="center" side="bottom" className="tooltip-content">
        <TooltipArrow />
        <div className="flex items-center flex-col">
          <p>hello</p>
          <p>world</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
