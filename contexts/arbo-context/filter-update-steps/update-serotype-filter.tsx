import {
    HandleArboFilterUpdateInput,
    HandleArboFilterUpdateOutput,
  } from "../arbo-filter-update-steps";
  
  /*
  If you deselect DENV, we need to wipe the serotype filter.
  */
  export const updateSerotypeFilter = (
    input: HandleArboFilterUpdateInput
  ): HandleArboFilterUpdateOutput => {
    if(input.action.payload.filter !== 'pathogen') {
      return input;
    }
  
    const selectedArboVirus = input.state.selectedFilters['pathogen'] ?? [];
  
    if(selectedArboVirus.indexOf("DENV") != -1) {
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
  