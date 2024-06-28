import { PathogenContextState } from "@/contexts/pathogen-context/pathogen-context";
import { SelectFilter, SelectFilterProps, SelectFilterType } from "./select-filter";

type MultiSelectFilterProps<
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
> = Omit<SelectFilterProps<TEstimate, TPathogenContextState>, 'selectFilterType'>

export const MultiSelectFilter = <
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
>(props: MultiSelectFilterProps<TEstimate, TPathogenContextState>) => (
  <SelectFilter
    selectFilterType={SelectFilterType.MULTI_SELECT}
    {...props}
  />
)