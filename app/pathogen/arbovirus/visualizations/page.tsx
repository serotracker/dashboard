"use client"

import { ArbovirusFilters } from "../dashboard/filters";
import { GenericPathogenVisualizationsPage } from "../../generic-pathogen-visualizations-page";
import { arbovirusVisualizationInformationArray, getUrlParameterFromVisualizationId, isArbovirusVisualizationUrlParameter } from './visualization-page-config';
import { Suspense, useContext } from "react";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";

export default function VisualizationsPage() {
  const { filteredData } = useContext(ArboContext);

  return (
    <Suspense>
      <GenericPathogenVisualizationsPage
        isValidVisualizationUrlParameter={isArbovirusVisualizationUrlParameter}
        data={filteredData}
        getVisualizationInformationFromVisualizationUrlParameter={(urlParameter) => arbovirusVisualizationInformationArray.find((element) => urlParameter === element.urlParameter)}
        filtersComponent={ArbovirusFilters}
        getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
      />
    </Suspense>
  );
}