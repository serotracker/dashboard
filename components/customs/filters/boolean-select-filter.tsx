import { PathogenContextState } from "@/contexts/pathogen-context/pathogen-context";
import { BooleanSelectOptionString, SelectFilter, SelectFilterProps, SelectFilterType } from "./select-filter";

type BooleanSelectFilterProps<
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
> = Omit<SelectFilterProps<TEstimate, TPathogenContextState>, 'selectFilterType'>

export const BooleanSelectFilter = <
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
>(props: BooleanSelectFilterProps<TEstimate, TPathogenContextState>) => (
  <SelectFilter
    selectFilterType={SelectFilterType.BOOLEAN_SELECT}
    {...props}
  />
)