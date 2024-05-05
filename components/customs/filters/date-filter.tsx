import { PathogenContextActionType, PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { GenericFilter } from "./generic-filter";
import { SendFilterChangeDispatch } from "@/app/pathogen/arbovirus/dashboard/filters";
import { DatePicker } from "@/components/ui/datepicker";
import { ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import parseISO from "date-fns/parseISO";
import { TooltipContentRenderingFunction } from "./available-filters";

interface DateFilterProps {
  filter: string;
  placeholder: string;
  renderTooltipContent: TooltipContentRenderingFunction | undefined;
  sendFilterChangeDispatch: SendFilterChangeDispatch;
  state: PathogenContextType<ArbovirusEstimate>,
  data: any
}

export const DateFilter = (props: DateFilterProps): React.ReactNode => (
  <GenericFilter
    filter={props.filter}
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