import {
  HandleFilterUpdateInput,
  HandleFilterUpdateOutput,
} from "../../pathogen-context/filter-update-steps";
  
/*
If you deselect DENV, we need to wipe the serotype filter.
*/
export const updateSerotypeFilter = <TData extends Record<string, unknown>>(
  input: HandleFilterUpdateInput<TData>
): HandleFilterUpdateOutput<TData> => {
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
  