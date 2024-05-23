import { PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { SendFilterChangeDispatch } from "../filters";
import { Checkbox } from "@/components/ui/checkbox";
import { TooltipContentRenderingFunction } from "./available-filters";
import { Button } from "@/components/ui/button";

export interface ColouredCheckboxFilterProps<TEstimate extends Record<string, unknown>> {
  filter: string;
  placeholder: string;
  sendFilterChangeDispatch: SendFilterChangeDispatch;
  optionSortingFunction?: (a: string, b:string) => number;
  renderTooltipContent: TooltipContentRenderingFunction | undefined;
  state: PathogenContextType<TEstimate>;
  data: TEstimate[];
  filterOptions: Array<string | undefined | null>;
  optionToLabelMap: Record<string, string | undefined>;
  optionToColourClassnameMap: Record<string, string | undefined>;
  clearAllButtonText: string;
}

export const ColouredCheckboxFilter = <TEstimate extends Record<string, unknown>>(props: ColouredCheckboxFilterProps<TEstimate>) => {
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

  return (
    <div className={"flex justify-between lg:justify-center flex-wrap lg:flex-col pb-3"}>
      {props.filterOptions
        .filter((option): option is NonNullable<typeof option> => !!option)
        .sort((a, b) => props.optionSortingFunction ? props.optionSortingFunction(a, b) : 0)
        .map((option) => (
          <div
            key={option}
            className="items-top flex space-x-2 my-1 mb-2"
          >
            <Checkbox
              id={`checkbox-${option}`}
              className={props.optionToColourClassnameMap[option] ?? 'data-[state=checked]:bg-sky-100'}
              checked={
                props.state.selectedFilters[props.filter]
                  ? props.state.selectedFilters[props.filter].includes(
                      option
                    )
                  : false
              }
              onCheckedChange={(checked: boolean) => {
                handleOnClickCheckbox(option, checked);
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor={`checkbox-${option}`}
                className={
                  "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                }
              >
                {props.optionToLabelMap[option] ?? option}
              </label>
            </div>
          </div>
        ))
      }
      <Button className="mt-2 w-full" variant={'ghost'} onClick={clearAllHandler}> {props.clearAllButtonText} </Button>
    </div>
  );
};