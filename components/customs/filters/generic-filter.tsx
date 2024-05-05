import { ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import { TooltipContentRenderingFunction } from "./available-filters";
import { FilterTooltip } from "./filter-tooltip";
import { PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";

interface GenericFilterProps {
  filter: string;
  children: React.ReactNode;
  state: PathogenContextType<ArbovirusEstimate>;
  renderTooltipContent: TooltipContentRenderingFunction | undefined
}

export const GenericFilter = (props: GenericFilterProps): React.ReactNode => (
  <div className="pb-3 flex w-1/2 md:w-1/3 lg:w-full px-2 lg:px-0" key={props.filter}>
    {props.children}
    {props.renderTooltipContent && (
      <FilterTooltip
        className='pl-2'
        renderTooltipContent={props.renderTooltipContent}
        state={props.state}
      />
    )}
  </div>
)