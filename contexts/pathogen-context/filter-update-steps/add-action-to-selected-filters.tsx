import { HandleFilterUpdateInput, HandleFilterUpdateOutput } from "../../pathogen-context/filter-update-steps";
import { PathogenContextState } from "../pathogen-context";

export const addActionToSelectedFilters = <
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
>(
  input: HandleFilterUpdateInput<TData, TPathogenContextState>
): HandleFilterUpdateOutput<TData, TPathogenContextState> => {
  const newSelectedFilters = {
    ...input.state.selectedFilters,
    [input.action.payload.filter]: input.action.payload.value,
  }

  return {
    ...input,
    state: {
      ...input.state,
      selectedFilters: newSelectedFilters
    },
  }
};
