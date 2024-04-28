import { HandleFilterUpdateInput, HandleFilterUpdateOutput } from "../../pathogen-context/filter-update-steps";

export const addActionToSelectedFilters = (
  input: HandleFilterUpdateInput
): HandleFilterUpdateOutput => {
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
