import { SelectFilter, SelectFilterProps, SelectFilterType } from "./select-filter";

type SingleSelectFilterProps = Omit<SelectFilterProps, 'selectFilterType'>

export const SingleSelectFilter = (props: SingleSelectFilterProps) => (
  <SelectFilter
    selectFilterType={SelectFilterType.SINGLE_SELECT}
    {...props}
  />
)