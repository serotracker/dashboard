import { PathogenContextState } from "@/contexts/pathogen-context/pathogen-context";
import { SelectFilter, SelectFilterProps, SelectFilterType } from "./select-filter";

type SingleSelectFilterProps<
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
> = Omit<SelectFilterProps<TEstimate, TPathogenContextState>, 'selectFilterType'>

export const SingleSelectFilter = <
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
>(props: SingleSelectFilterProps<TEstimate, TPathogenContextState>) => (
  <SelectFilter
    selectFilterType={SelectFilterType.SINGLE_SELECT}
    {...props}
  />
)