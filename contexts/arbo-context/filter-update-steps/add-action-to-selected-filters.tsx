import { HandleArboFilterUpdateInput, HandleArboFilterUpdateOutput } from "../arbo-filter-update-steps";

export const addActionToSelectedFilters = (
  input: HandleArboFilterUpdateInput
): HandleArboFilterUpdateOutput => {
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
