
"use client";
import { VisualizationInformation } from "../../generic-pathogen-visualizations-page";
import { typedObjectEntries } from "@/lib/utils";
import { GetUrlParameterFromVisualizationIdFunction } from '@/components/customs/visualizations/visualization-header';
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";

export enum MersVisualizationId {
  PLACEHOLDER = "PLACEHOLDER",
}

export const isMersVisualizationId = (
  visualizationId: string
): visualizationId is MersVisualizationId =>
  Object.values(MersVisualizationId).some((element) => element === visualizationId);

export enum MersVisualizationUrlParameter {
  "placeholder" = "placeholder"
}

export type MersVisualizationInformation<TDropdownOption extends string> = VisualizationInformation<
  MersVisualizationId,
  MersVisualizationUrlParameter,
  MersEstimate,
  TDropdownOption
>;

export const isMersVisualizationUrlParameter = (
  visualizationUrlParameter: string
): visualizationUrlParameter is MersVisualizationUrlParameter =>
  Object.values(MersVisualizationUrlParameter).some((element) => element === visualizationUrlParameter);

export const mersVisualizationInformation: Record<MersVisualizationId, MersVisualizationInformation<string>> = {
  [MersVisualizationId.PLACEHOLDER]: {
    id: MersVisualizationId.PLACEHOLDER,
    urlParameter:
      MersVisualizationUrlParameter[
        "placeholder"
      ],
    getDisplayName: () => "Placeholder",
    renderVisualization: () => <p>Placeholder</p>
  }
}

export const mersVisualizationInformationArray = typedObjectEntries(mersVisualizationInformation).map(([_, value]) => value);
export const getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<
  MersVisualizationId,
  MersVisualizationUrlParameter
> = ({ visualizationId }) => ({urlParameter: mersVisualizationInformation[visualizationId].urlParameter})
