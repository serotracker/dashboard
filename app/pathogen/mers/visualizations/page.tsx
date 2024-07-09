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
import { CamelPopulationDataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/camel-population-data-context";

export default function VisualizationsPage() {
  const { filteredData, faoMersEventData } = useContext(MersContext);
  const { yearlyFaoCamelPopulationData } = useContext(CamelPopulationDataContext);

  return (
    <Suspense>
      <GenericPathogenVisualizationsPage
        isValidVisualizationUrlParameter={isMersVisualizationUrlParameter}
        data={[
          ...filteredData,
          ...faoMersEventData,
          ...(yearlyFaoCamelPopulationData ?? [])
        ]}
        getVisualizationInformationFromVisualizationUrlParameter={(urlParameter) => mersVisualizationInformationArray.find((element) => urlParameter === element.urlParameter)}
        filtersComponent={MersFilters}
        getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
      />
    </Suspense>
  );
}