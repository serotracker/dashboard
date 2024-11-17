import { MapRef } from "react-map-gl"
import { pipe } from "fp-ts/lib/function.js";
import { adjustMapPosition } from "./filter-update-steps/adjust-map-position";
import { updatePediatricAgeGroupFilter } from "./filter-update-steps/update-pediatric-age-group-filter";
import { addActionToSelectedFilters } from "./filter-update-steps/add-action-to-selected-filters";
import { applyNewSelectedFilters } from "./filter-update-steps/apply-new-selected-filters";
import { updateSerotypeFilter } from "./filter-update-steps/update-serotype-filter";
import { PathogenContextAction, PathogenContextState } from "./pathogen-context";
import { updateMapLayerFilters } from "./filter-update-steps/update-map-layer-filters";

export interface HandleFilterUpdateInput<
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
> {
  state: TPathogenContextState,
  action: PathogenContextAction,
  map: MapRef | undefined
}

export type HandleFilterUpdateOutput<
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
> = HandleFilterUpdateInput<TData, TPathogenContextState>;

export const handleFilterUpdate = <
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
>(
  input: HandleFilterUpdateInput<TData, TPathogenContextState>
): HandleFilterUpdateOutput<TData, TPathogenContextState> => {
  return pipe(
    input,
    addActionToSelectedFilters,
    adjustMapPosition,
    updateMapLayerFilters,
    updatePediatricAgeGroupFilter,
    updateSerotypeFilter,
    applyNewSelectedFilters
  );
}