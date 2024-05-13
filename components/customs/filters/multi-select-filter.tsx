import { SelectFilter, SelectFilterProps, SelectFilterType } from "./select-filter";

type MultiSelectFilterProps<TEstimate extends Record<string, unknown>> = Omit<SelectFilterProps<TEstimate>, 'selectFilterType'>

export const MultiSelectFilter = <TEstimate extends Record<string, unknown>>(props: MultiSelectFilterProps<TEstimate>) => (
  <SelectFilter
    selectFilterType={SelectFilterType.MULTI_SELECT}
    {...props}
  />
)