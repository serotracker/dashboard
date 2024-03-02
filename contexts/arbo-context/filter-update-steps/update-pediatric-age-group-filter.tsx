import {
  HandleArboFilterUpdateInput,
  HandleArboFilterUpdateOutput,
} from "../arbo-filter-update-steps";

export const updatePediatricAgeGroupFilter = (
  input: HandleArboFilterUpdateInput
): HandleArboFilterUpdateOutput => {
  if(input.action.payload.filter !== 'ageGroup') {
    return input;
  }

  const selectedAgeGroups = input.state.selectedFilters['ageGroup'] ?? [];

  if(selectedAgeGroups.length === 1 && selectedAgeGroups[0] === 'Children and Youth (0-17 years)') {
    return input;
  }

  return {
    ...input,
    state: {
      ...input.state,
      selectedFilters: {
        ...input.state.selectedFilters,
        pediatricAgeGroup: []
      }
    }
  }
};
