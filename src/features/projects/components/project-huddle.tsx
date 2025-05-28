import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProjectHuddle() {
  return (
    <div className="flex items-center space-x-2 rounded-lg my-2 cursor-pointer bg-gray-800/70 p-[1.5px]">
      <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Hello</Button>
            </TooltipTrigger>
            <TooltipContent
              align="center"
              side="bottom"
              className="w-40 tooltip-content"
            >
              <TooltipArrow />
              <div className="flex items-center flex-col">
                <p>hello</p>
                <p>world</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
