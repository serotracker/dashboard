import { useMemo } from 'react';
import uniq from 'lodash/uniq';
import { pipe } from "fp-ts/lib/function.js";
import { PathogenContextState, PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { SendFilterChangeDispatch } from "../filters";
import { Checkbox } from "@/components/ui/checkbox";
import { TooltipContentRenderingFunction } from "./available-filters";
import { Button } from "@/components/ui/button";
import { typedGroupBy, typedObjectKeys } from '@/lib/utils';
import { ColouredCheckbox } from './coloured-checkbox-filter';

export interface GroupedColouredCheckboxFilterProps<
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
> {
  filter: string;
  placeholder: string;
  sendFilterChangeDispatch: SendFilterChangeDispatch;
  optionSortingFunction?: (a: string, b:string) => number;
  optionToSuperOptionFunction: ((option: string) => string) | undefined;
  superOptionToLabelMap?: ((superOption: string) => string) | undefined;
  renderTooltipContent: TooltipContentRenderingFunction | undefined;
  state: PathogenContextType<TEstimate, TPathogenContextState>;
  data: TEstimate[] | Record<string, unknown>;
  filterOptions: Array<string | undefined | null>;
  optionToLabelMap: Record<string, string | undefined>;
  optionToColourClassnameMap: Record<string, string | undefined>;
  clearAllButtonText: string;
}

export const GroupedColouredCheckboxFilter = <
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
>(props: GroupedColouredCheckboxFilterProps<TEstimate, TPathogenContextState>) => {
  const { filterOptions, optionSortingFunction, optionToSuperOptionFunction } = props;

  const handleOnClickCheckbox = (option: string, checked: boolean) => {
    const value = props.state.selectedFilters[props.filter] ?? [];

    if (checked) {
      value.push(option);
    } else {
      value.splice(value.indexOf(option), 1);
    }

    props.sendFilterChangeDispatch({
      value: value,
      newFilter: props.filter,
      state: props.state,
      data: props.data
    })
  };

  const clearAllHandler = () => {
    props.sendFilterChangeDispatch({
      value: [],
      newFilter: props.filter,
      state: props.state,
      data: props.data
    })
  };

  const groupedFilterOptions = useMemo(() => 
    pipe(
      filterOptions,
      (filterOptions) => filterOptions.filter((option): option is NonNullable<typeof option> => !!option),
      (filterOptions) => filterOptions.sort((a, b) => optionSortingFunction ? optionSortingFunction(a, b) : 0),
      (filterOptions) => typedGroupBy(filterOptions, (filterOption) => optionToSuperOptionFunction ? optionToSuperOptionFunction(filterOption) : filterOption)
    )
  , [ filterOptions, optionSortingFunction ]);

  return (
    <div className={"flex justify-between lg:justify-center flex-wrap lg:flex-col pb-3"}>
      {typedObjectKeys(groupedFilterOptions)
        .map((filterSuperOption) => {
          const filterSubOptions = groupedFilterOptions[filterSuperOption];

          return (
            <div
              key={filterSuperOption}
            >
              <ColouredCheckbox
                option={filterSuperOption}
                checkedColourClassname={'data-[state=checked]:bg-sky-100'}
                checked={(props.state.selectedFilters[props.filter] ?? []).some((element) => filterSubOptions.includes(element))}
                onCheckedChange={(checked: boolean) => {
                  const value = props.state.selectedFilters[props.filter] ?? [];
                  let newValue: string[] = [];

                  if (checked) {
                    newValue = uniq([
                      ...filterSubOptions,
                      ...value
                    ])
                  } else {
                    newValue = uniq(value.filter((element) => !filterSubOptions.includes(element)));
                  }

                  props.sendFilterChangeDispatch({
                    value: newValue,
                    newFilter: props.filter,
                    state: props.state,
                    data: props.data
                  })
                }}
                label={props.superOptionToLabelMap ? props.superOptionToLabelMap(filterSuperOption) : filterSuperOption}
              />
              <div className='ml-5'>
                {filterSubOptions.map((option) => <ColouredCheckbox
                  option={option}
                  checkedColourClassname={props.optionToColourClassnameMap[option] ?? 'data-[state=checked]:bg-sky-100'}
                  checked={ props.state.selectedFilters[props.filter]
                    ? props.state.selectedFilters[props.filter].includes(option)
                    : false
                  }
                  onCheckedChange={(checked: boolean) => {handleOnClickCheckbox(option, checked)}}
                  label={props.optionToLabelMap[option] ?? option}
                />)}
              </div>
            </div>
          );
        })
      }
      <Button
        className="mt-2 w-full"
        variant={'ghost'}
        onClick={clearAllHandler}
      >
        {props.clearAllButtonText}
      </Button>
    </div>
  );
};