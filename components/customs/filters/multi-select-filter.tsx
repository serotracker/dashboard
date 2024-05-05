import { SelectFilter, SelectFilterProps, SelectFilterType } from "./select-filter";

type MultiSelectFilterProps = Omit<SelectFilterProps, 'selectFilterType'>

export const MultiSelectFilter = (props: MultiSelectFilterProps) => (
  <SelectFilter
    selectFilterType={SelectFilterType.MULTI_SELECT}
    {...props}
  />
)