import {
  HandleFilterUpdateInput,
  HandleFilterUpdateOutput,
} from "../../pathogen-context/filter-update-steps";
import { PathogenContextState } from "../pathogen-context";

export const updatePediatricAgeGroupFilter = <
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
>(
  input: HandleFilterUpdateInput<TData, TPathogenContextState>
): HandleFilterUpdateOutput<TData, TPathogenContextState> => {
  if(input.action.payload.filter !== 'ageGroup') {
    return input;
  }

  const selectedAgeGroups = input.state.selectedFilters['ageGroup'] ?? [];
  
  if(selectedAgeGroups.includes('Children and Youth (0-17 years)')) {
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
