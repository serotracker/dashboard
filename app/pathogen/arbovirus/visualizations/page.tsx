"use client"

import { ArbovirusFilters } from "../dashboard/filters";
import { GenericPathogenVisualizationsPage } from "../../generic-pathogen-visualizations-page";
import { arbovirusVisualizationInformationArray, getUrlParameterFromVisualizationId, isArbovirusVisualizationUrlParameter } from './visualization-page-config';

export default function VisualizationsPage() {
  return (
    <GenericPathogenVisualizationsPage
      isValidVisualizationUrlParameter={isArbovirusVisualizationUrlParameter}
      getVisualizationInformationFromVisualizationUrlParameter={(urlParameter) => arbovirusVisualizationInformationArray.find((element) => urlParameter === element.urlParameter)}
      filtersComponent={ArbovirusFilters}
      getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
    />
  );
}