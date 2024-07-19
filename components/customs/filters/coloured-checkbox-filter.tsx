import { PathogenContextState, PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { SendFilterChangeDispatch } from "../filters";
import { Checkbox } from "@/components/ui/checkbox";
import { TooltipContentRenderingFunction } from "./available-filters";
import { Button } from "@/components/ui/button";

interface ColouredCheckboxProps {
  option: string;
  label: string;
  checkedColourClassname: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ColouredCheckbox = (props: ColouredCheckboxProps) => (
  <div
    key={props.option}
    className="items-top flex space-x-2 my-1 mb-2"
  >
    <Checkbox
      id={`checkbox-${props.option}`}
      className={props.checkedColourClassname}
      checked={props.checked}
      onCheckedChange={(checked: boolean) => props.onCheckedChange(checked)}
    />
    <div className="grid gap-1.5 leading-none">
      <label
        htmlFor={`checkbox-${props.option}`}
        className={
          "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        }
      >
        {props.label}
      </label>
    </div>
  </div>
)

export interface ColouredCheckboxFilterProps<
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
> {
  filter: string;
  placeholder: string;
  sendFilterChangeDispatch: SendFilterChangeDispatch;
  optionSortingFunction?: (a: string, b:string) => number;
  renderTooltipContent: TooltipContentRenderingFunction | undefined;
  state: PathogenContextType<TEstimate, TPathogenContextState>;
  data: TEstimate[] | Record<string, unknown>;
  filterOptions: Array<string | undefined | null>;
  optionToLabelMap: Record<string, string | undefined>;
  optionToColourClassnameMap: Record<string, string | undefined>;
  clearAllButtonText: string;
}

export const ColouredCheckboxFilter = <
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
>(props: ColouredCheckboxFilterProps<TEstimate, TPathogenContextState>) => {
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
        .map((option) => <ColouredCheckbox
          option={option}
          checkedColourClassname={props.optionToColourClassnameMap[option] ?? 'data-[state=checked]:bg-sky-100'}
          checked={ props.state.selectedFilters[props.filter]
            ? props.state.selectedFilters[props.filter].includes(option)
            : false
          }
          onCheckedChange={(checked: boolean) => {handleOnClickCheckbox(option, checked)}}
          label={props.optionToLabelMap[option] ?? option}
        />)
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