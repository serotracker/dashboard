import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContentRenderingFunction } from "./available-filters";
import { PathogenContextState, PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";

interface FieldTooltipProps<
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
> {
  renderTooltipContent: TooltipContentRenderingFunction;
  state: PathogenContextType<TEstimate, TPathogenContextState>;
  className?: string;
}

export const FilterTooltip = <
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
>(props: FieldTooltipProps<TEstimate, TPathogenContextState>): React.ReactNode => (
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
            minWidth: "230px",
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <div
            className="bg-background w-full h-full p-4 rounded text-white"
          >
            <props.renderTooltipContent state={props.state} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
)