import { SelectFilter, SelectFilterProps, SelectFilterType } from "./select-filter";

type SingleSelectFilterProps<TEstimate extends Record<string, unknown>> = Omit<SelectFilterProps<TEstimate>, 'selectFilterType'>

export const SingleSelectFilter = <TEstimate extends Record<string, unknown>>(props: SingleSelectFilterProps<TEstimate>) => (
  <SelectFilter
    selectFilterType={SelectFilterType.SINGLE_SELECT}
    {...props}
  />
)