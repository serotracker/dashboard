import { Button } from "@/components/ui/button";
import { PathogenContextActionType, PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import { useCallback } from "react";

interface ResetFiltersButtonProps {
  state: PathogenContextType<ArbovirusEstimate>;
  data: any;
}

export const ResetFiltersButton = (props: ResetFiltersButtonProps) => {
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
    <div>
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