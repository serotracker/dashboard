"use client"

import { useContext, Suspense } from "react";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { GenericPathogenVisualizationsPage } from "../../generic-pathogen-visualizations-page";
import { MersFilters } from "../dashboard/filters";
import { 
  getUrlParameterFromVisualizationId,
  isMersVisualizationUrlParameter,
  mersVisualizationInformationArray
} from "./visualization-page-config";

export default function VisualizationsPage() {
  const { filteredData } = useContext(MersContext);

  return (
    <Suspense>
      <GenericPathogenVisualizationsPage
        isValidVisualizationUrlParameter={isMersVisualizationUrlParameter}
        data={filteredData}
        getVisualizationInformationFromVisualizationUrlParameter={(urlParameter) => mersVisualizationInformationArray.find((element) => urlParameter === element.urlParameter)}
        filtersComponent={MersFilters}
        getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
      />
    </Suspense>
  );
}