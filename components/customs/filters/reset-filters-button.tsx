import { Button } from "@/components/ui/button";
import { PathogenContextActionType, PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { useCallback } from "react";

interface ResetFiltersButtonProps<TEstimate extends Record<string, unknown>> {
  state: PathogenContextType<TEstimate>;
  hidden: boolean;
  data: any;
}

export const ResetFiltersButton = <TEstimate extends Record<string, unknown>>(props: ResetFiltersButtonProps<TEstimate>) => {
  const resetFilters = useCallback(() => {
    // Dispatch action to reset filters
    props.state.dispatch({
      type: PathogenContextActionType.RESET_FILTERS,
      payload: {
        data: props.data ? props.data.arbovirusEstimates : [],
      }
    });
  }, [props.state, props.data]);

  return (
    <div className={props.hidden ? "hidden" : ""}>
      <Button
        className="w-full"
        onClick={resetFilters}
        variant={"outline"}
      >
        Reset Filters
      </Button>
    </div>
  )
}