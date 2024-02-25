import { MapRef } from "react-map-gl"
import { ArboAction, ArboStateType } from "./arbo-context"
import { pipe } from "fp-ts/lib/function.js";
import { adjustMapPositionStep } from "./filter-update-steps/adjust-map-position-step";
import { updatePediatricAgeGroupFilter } from "./filter-update-steps/update-pediatric-age-group-filter";
import { addActionToSelectedFiltersStep } from "./filter-update-steps/add-action-to-selected-filters-step";
import { applyNewSelectedFiltersStep } from "./filter-update-steps/apply-new-selected-filters-step";

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
    addActionToSelectedFiltersStep,
    adjustMapPositionStep,
    updatePediatricAgeGroupFilter,
    applyNewSelectedFiltersStep
  );
}