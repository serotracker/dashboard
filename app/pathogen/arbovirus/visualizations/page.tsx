"use client"

import { ArbovirusFilters } from "../dashboard/filters";
import { GenericPathogenVisualizationsPage } from "../../generic-pathogen-visualizations-page";
import { getUrlParameterFromVisualizationId, isArbovirusVisualizationUrlParameter, useVisualizationPageConfiguration } from './visualization-page-config';
import { Suspense } from "react";
import { useGroupedArbovirusEstimateData } from "../use-arbo-primary-estimate-data";

export default function VisualizationsPage() {
  const { primaryEstimateData } = useGroupedArbovirusEstimateData();
  const { arbovirusVisualizationInformationArray } = useVisualizationPageConfiguration()

  return (
    <Suspense>
      <GenericPathogenVisualizationsPage
        isValidVisualizationUrlParameter={isArbovirusVisualizationUrlParameter}
        data={primaryEstimateData.filteredData}
        getVisualizationInformationFromVisualizationUrlParameter={(urlParameter) => arbovirusVisualizationInformationArray.find((element) => urlParameter === element.urlParameter)}
        filtersComponent={ArbovirusFilters}
        getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
      />
    </Suspense>
  );
}