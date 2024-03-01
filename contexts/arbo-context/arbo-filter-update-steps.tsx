import { MapRef } from "react-map-gl"
import { ArboAction, ArboStateType } from "./arbo-context"
import { pipe } from "fp-ts/lib/function.js";
import { adjustMapPosition } from "./filter-update-steps/adjust-map-position";
import { updatePediatricAgeGroupFilter } from "./filter-update-steps/update-pediatric-age-group-filter";
import { addActionToSelectedFilters } from "./filter-update-steps/add-action-to-selected-filters";
import { applyNewSelectedFilters } from "./filter-update-steps/apply-new-selected-filters";

export interface HandleArboFilterUpdateInput {
  state: ArboStateType,
  action: ArboAction,
  map: MapRef | undefined
}

export interface HandleArboFilterUpdateOutput {
  state: ArboStateType,
  action: ArboAction,
  map: MapRef | undefined
}

export const handleArboFilterUpdate = (input: HandleArboFilterUpdateInput): HandleArboFilterUpdateOutput => {
  return pipe(
    input,
    addActionToSelectedFilters,
    adjustMapPosition,
    updatePediatricAgeGroupFilter,
    applyNewSelectedFilters
  );
}