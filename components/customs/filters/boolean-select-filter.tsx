import { BooleanSelectOptionString, SelectFilter, SelectFilterProps, SelectFilterType } from "./select-filter";

type BooleanSelectFilterProps<TEstimate extends Record<string, unknown>> = Omit<SelectFilterProps<TEstimate>, 'selectFilterType'>

export const BooleanSelectFilter = <TEstimate extends Record<string, unknown>>(props: BooleanSelectFilterProps<TEstimate>) => (
  <SelectFilter
    selectFilterType={SelectFilterType.BOOLEAN_SELECT}
    {...props}
  />
)