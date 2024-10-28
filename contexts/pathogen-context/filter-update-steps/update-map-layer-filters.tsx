import {
  HandleFilterUpdateInput,
  HandleFilterUpdateOutput,
} from "../../pathogen-context/filter-update-steps";
import { PathogenContextState } from "../pathogen-context";
  
/*
If you deselect DENV, we need to wipe the serotype filter.
*/
export const updateMapLayerFilters = <
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
>(
  input: HandleFilterUpdateInput<TData, TPathogenContextState>
): HandleFilterUpdateOutput<TData, TPathogenContextState> => {
  if(input.action.payload.filter === 'esm') {
    return {
      ...input,
      state: {
        ...input.state,
        selectedFilters: {
          ...input.state.selectedFilters,
          positiveCases: []
        }
      }
    }
  }

  if(input.action.payload.filter === 'positiveCases') {
    return {
      ...input,
      state: {
        ...input.state,
        selectedFilters: {
          ...input.state.selectedFilters,
          esm: []
        }
      }
    }
  }

  return input;
};
  