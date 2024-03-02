import {
  BoundingBox,
  combineBoundingBoxes,
  getBoundingBoxFromCountryName,
  getBoundingBoxFromUNRegion,
} from "@/lib/bounding-boxes";
import {
  HandleArboFilterUpdateInput,
  HandleArboFilterUpdateOutput,
} from "../arbo-filter-update-steps";
import { isUNRegion } from "@/lib/un-regions";

interface GetAllBoundingBoxesFromSelectedFiltersInput {
  selectedFilters: Record<string, string[] | undefined>;
}

const getAllBoundingBoxesFromSelectedFilters = (
  input: GetAllBoundingBoxesFromSelectedFiltersInput
): BoundingBox[] => {
  const { selectedFilters } = input;

  const selectedCountries = selectedFilters["country"] ?? [];
  const boundingBoxesFromSelectedCountries = selectedCountries
    .map((countryName) => getBoundingBoxFromCountryName(countryName))
    .filter(
      (boundingBox: BoundingBox | undefined): boundingBox is BoundingBox =>
        !!boundingBox
    );
  const selectedUNRegions = selectedFilters["unRegion"] ?? [];
  const boundingBoxesFromSelectedUnRegions = selectedUNRegions
    .map((unRegion) =>
      isUNRegion(unRegion) ? getBoundingBoxFromUNRegion(unRegion) : undefined
    )
    .filter(
      (boundingBox: BoundingBox | undefined): boundingBox is BoundingBox =>
        !!boundingBox
    );

  return [
    ...boundingBoxesFromSelectedCountries,
    ...boundingBoxesFromSelectedUnRegions,
  ];
};

export const adjustMapPosition = (
  input: HandleArboFilterUpdateInput
): HandleArboFilterUpdateOutput => {
  if (!input.map) {
    return input;
  }

  if (
    input.action.payload.filter !== "country" &&
    input.action.payload.filter !== "unRegion"
  ) {
    return input;
  }

  const allBoundingBoxes = getAllBoundingBoxesFromSelectedFilters({
    selectedFilters: input.state.selectedFilters,
  });

  if (allBoundingBoxes.length === 0) {
    input.map.fitBounds([-180, -90, 180, 90]);

    return input;
  }

  const boundingBoxToMoveMapTo = combineBoundingBoxes(allBoundingBoxes);

  input.map.fitBounds(boundingBoxToMoveMapTo);

  return input;
};
