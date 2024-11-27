import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GenericTooltipProps {
  className?: string;
  tooltipContent: React.ReactNode;
}

export const GenericTooltip = (props: GenericTooltipProps): React.ReactNode => (
  <div className={props.className}>
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="h-5 w-5 text-gray-500 cursor-pointer"
          >
            &#9432;
          </div>
        </TooltipTrigger>
        <TooltipContent
          style={{
            position: "absolute",
            top: "50px", // position below the trigger
            left:"-120px",
            minWidth: "330px",
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <div
            className="bg-background w-full h-full p-4 rounded text-white"
          >
            {props.tooltipContent}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
)