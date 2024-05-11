
"use client"

import { GenericPathogenVisualizationsPage } from "../../generic-pathogen-visualizations-page";
import { SarsCov2Filters } from "../dashboard/filters";
import { 
  getUrlParameterFromVisualizationId,
  isSarsCov2VisualizationUrlParameter,
  sarsCov2VisualizationInformationArray
} from "./visualization-page-config";

export default function VisualizationsPage() {
  return (
    <GenericPathogenVisualizationsPage
      isValidVisualizationUrlParameter={isSarsCov2VisualizationUrlParameter}
      getVisualizationInformationFromVisualizationUrlParameter={(urlParameter) => sarsCov2VisualizationInformationArray.find((element) => urlParameter === element.urlParameter)}
      filtersComponent={SarsCov2Filters}
      getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
    />
  );
}