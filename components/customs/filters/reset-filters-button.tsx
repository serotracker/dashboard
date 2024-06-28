import { Button } from "@/components/ui/button";
import { PathogenContextActionType, PathogenContextState, PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { useCallback } from "react";

interface ResetFiltersButtonProps<
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
> {
  state: PathogenContextType<TEstimate, TPathogenContextState>;
  hidden: boolean;
  data: TEstimate[];
}

export const ResetFiltersButton = <
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
>(props: ResetFiltersButtonProps<TEstimate, TPathogenContextState>) => {
  const resetFilters = useCallback(() => {
    // Dispatch action to reset filters
    props.state.dispatch({
      type: PathogenContextActionType.RESET_FILTERS,
      payload: {
        data: props.data ? props.data : [],
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