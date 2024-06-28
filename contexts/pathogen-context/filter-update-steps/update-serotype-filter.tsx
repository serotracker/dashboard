import {
  HandleFilterUpdateInput,
  HandleFilterUpdateOutput,
} from "../../pathogen-context/filter-update-steps";
import { PathogenContextState } from "../pathogen-context";
  
/*
If you deselect DENV, we need to wipe the serotype filter.
*/
export const updateSerotypeFilter = <
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
>(
  input: HandleFilterUpdateInput<TData, TPathogenContextState>
): HandleFilterUpdateOutput<TData, TPathogenContextState> => {
  if(input.action.payload.filter !== 'pathogen') {
    return input;
  }
  
  const selectedArboVirus = input.state.selectedFilters['pathogen'] ?? [];
  
  if(!selectedArboVirus.includes("DENV")) {
      return input
  }
  
  
  return {
    ...input,
    state: {
      ...input.state,
      selectedFilters: {
        ...input.state.selectedFilters,
        serotype: []
      }
    }
  }
};
  