import { HandleFilterUpdateInput, HandleFilterUpdateOutput } from "../../pathogen-context/filter-update-steps";

export const addActionToSelectedFilters = <TData extends Record<string, unknown>>(
  input: HandleFilterUpdateInput<TData>
): HandleFilterUpdateOutput<TData> => {
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
