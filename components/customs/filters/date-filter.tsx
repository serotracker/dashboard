import { PathogenContextActionType, PathogenContextState, PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { GenericFilter } from "./generic-filter";
import { DatePicker } from "@/components/ui/datepicker";
import { parseISO } from 'date-fns';
import { TooltipContentRenderingFunction } from "./available-filters";
import { SendFilterChangeDispatch } from "../filters";

interface DateFilterProps<
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
> {
  filter: string;
  placeholder: string;
  renderTooltipContent: TooltipContentRenderingFunction | undefined;
  sendFilterChangeDispatch: SendFilterChangeDispatch;
  state: PathogenContextType<TEstimate, TPathogenContextState>,
  data: TEstimate[] | Record<string, unknown>;
}

export const DateFilter = <
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
>(props: DateFilterProps<TEstimate, TPathogenContextState>): React.ReactNode => (
  <GenericFilter
    filter={props.filter}
    state={props.state}
    renderTooltipContent={props.renderTooltipContent}
  >
    <DatePicker
      onChange={(date) => {
        const dateString = date?.toISOString();
        props.sendFilterChangeDispatch({
          value: dateString ? [dateString] : [],
          newFilter: props.filter,
          state: props.state,
          data: props.data
        });
      }}
      labelText={props.placeholder}
      date={
        props.state.selectedFilters[props.filter] &&
        props.state.selectedFilters[props.filter].length > 0
          ? parseISO(props.state.selectedFilters[props.filter][0])
          : undefined
      }
      clearDateFilter={() => {
        props.state.dispatch({
          type: PathogenContextActionType.UPDATE_FILTER,
          payload: {
            filter: props.filter,
            value: [],
            data: props.data ? props.data : [],
          },
        });
      }}
    />
  </GenericFilter>
)