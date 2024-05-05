import { FilterTooltip } from "./filter-tooltip";

interface GenericFilterProps {
  filter: string;
  children: React.ReactNode;
  tooltipContent: React.ReactNode | undefined;
}

export const GenericFilter = (props: GenericFilterProps): React.ReactNode => (
  <div className="pb-3 flex w-1/2 md:w-1/3 lg:w-full px-2 lg:px-0" key={props.filter}>
    {props.children}
    {props.tooltipContent && <FilterTooltip className='pl-2' tooltipContent={props.tooltipContent} />}
  </div>
)