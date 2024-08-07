"use client"

import { SarsCov2Context } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/sc2-context";
import { GenericPathogenVisualizationsPage } from "../../generic-pathogen-visualizations-page";
import { SarsCov2Filters } from "../dashboard/filters";
import { 
  getUrlParameterFromVisualizationId,
  isSarsCov2VisualizationUrlParameter,
  useVisualizationPageConfiguration
} from "./visualization-page-config";
import { Suspense, useContext } from "react";

export default function VisualizationsPage() {
  const { filteredData } = useContext(SarsCov2Context);
  const { sarsCov2VisualizationInformationArray } = useVisualizationPageConfiguration();

  return (
    <Suspense>
      <GenericPathogenVisualizationsPage
        isValidVisualizationUrlParameter={isSarsCov2VisualizationUrlParameter}
        data={filteredData}
        getVisualizationInformationFromVisualizationUrlParameter={(urlParameter) => sarsCov2VisualizationInformationArray.find((element) => urlParameter === element.urlParameter)}
        filtersComponent={SarsCov2Filters}
        getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
      />
    </Suspense>
  );
}