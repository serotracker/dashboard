import { useMemo, useCallback, useContext } from "react";
import assertNever from "assert-never";
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { isUNRegion, unRegionEnumToLabelMap } from "@/lib/un-regions";
import { isWHORegion } from "@/lib/who-regions";
import { barColoursForUnRegions, barColoursForWhoRegions, chartTitlesForUnRegions, chartTitlesForWhoRegions } from "./summary-by-region";
import { UnRegion, WhoRegion } from "@/gql/graphql";
import { HumanSeroprevalenceByRegion } from "./estimates-by-region/human-seroprevalence-by-region";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { AnimalSeroprevalenceByRegion } from "./estimates-by-region/animal-seroprevalence-by-region";
import { HumanViralPositivePrevalenceByRegion } from "./estimates-by-region/human-viral-positive-prevalence-by-region";
import { AnimalViralPositivePrevalenceByRegion } from "./estimates-by-region/animal-viral-positive-prevalence-by-region";

export enum EstimatesByRegionVariableOfInterestDropdownOption {
  HUMAN_SEROPREVALENCE = "HUMAN_SEROPREVALENCE",
  ANIMAL_SEROPREVALENCE = "ANIMAL_SEROPREVALENCE",
  HUMAN_VIRAL_PREVALENCE = "HUMAN_VIRAL_PREVALENCE",
  ANIMAL_VIRAL_PREVALENCE = "ANIMAL_VIRAL_PREVALENCE",
}

export enum EstimatesByRegionRegionDropdownOption {
  WHO_REGION = "WHO_REGION",
  UN_REGION = "UN_REGION",
}

interface EstimatesByRegionProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  selectedVariableOfInterest: EstimatesByRegionVariableOfInterestDropdownOption;
  selectedRegion: EstimatesByRegionRegionDropdownOption;
  legendConfiguration: LegendConfiguration;
}

export const EstimatesByRegion = (props: EstimatesByRegionProps) => {
  const {
    data,
    selectedVariableOfInterest,
    selectedRegion,
    legendConfiguration
  } = props;

  const regionGroupingFunction = useCallback((dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry) => {
    if(selectedRegion === EstimatesByRegionRegionDropdownOption.WHO_REGION) {
      return dataPoint.whoRegion;
    }
    if(selectedRegion === EstimatesByRegionRegionDropdownOption.UN_REGION) {
      return dataPoint.unRegion;
    }

    assertNever(selectedRegion);
  }, [ selectedRegion ]);

  const regionToDotColour = useCallback((region: WhoRegion | UnRegion) => {
    if(isWHORegion(region)) {
      return barColoursForWhoRegions[region];
    }
    if(isUNRegion(region)) {
      return barColoursForUnRegions[region];
    }
    assertNever(region);
  }, []);

  const regionToLegendLabel = useCallback((region: WhoRegion | UnRegion) => {
    if(isWHORegion(region)) {
      return chartTitlesForWhoRegions[region];
    }
    if(isUNRegion(region)) {
      return chartTitlesForUnRegions[region];
    }
    assertNever(region);
  }, []);

  const graph = useMemo(() => {
    if(selectedVariableOfInterest === EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE) {
      return <HumanSeroprevalenceByRegion
        data={data}
        regionGroupingFunction={regionGroupingFunction}
        regionToDotColour={regionToDotColour}
        regionToLegendLabel={regionToLegendLabel}
        legendConfiguration={legendConfiguration}
      />
    }
    if(selectedVariableOfInterest === EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_VIRAL_PREVALENCE) {
      return <HumanViralPositivePrevalenceByRegion
        data={data}
        regionGroupingFunction={regionGroupingFunction}
        regionToDotColour={regionToDotColour}
        regionToLegendLabel={regionToLegendLabel}
        legendConfiguration={legendConfiguration}
      />
    }
    if(selectedVariableOfInterest === EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE) {
      return <AnimalSeroprevalenceByRegion
        data={data}
        regionGroupingFunction={regionGroupingFunction}
        regionToDotColour={regionToDotColour}
        regionToLegendLabel={regionToLegendLabel}
        legendConfiguration={legendConfiguration}
      />
    }
    if(selectedVariableOfInterest === EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_VIRAL_PREVALENCE) {
      return <AnimalViralPositivePrevalenceByRegion
        data={data}
        regionGroupingFunction={regionGroupingFunction}
        regionToDotColour={regionToDotColour}
        regionToLegendLabel={regionToLegendLabel}
        legendConfiguration={legendConfiguration}
      />
    }
    assertNever(selectedVariableOfInterest);
  }, [ data, selectedVariableOfInterest, regionGroupingFunction, regionToDotColour, regionToLegendLabel, legendConfiguration ]);

  return graph;
}