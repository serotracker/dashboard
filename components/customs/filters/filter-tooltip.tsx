import { TooltipContentRenderingFunction } from "./available-filters";
import { PathogenContextState, PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { GenericTooltip } from "../generic-tooltip";

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
  <GenericTooltip 
    className={props.className}
    tooltipContent={<props.renderTooltipContent state={props.state} />}
  />
)