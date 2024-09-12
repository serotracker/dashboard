import { useMemo, useCallback, useContext } from "react";
import assertNever from "assert-never";
import { AnimalMersSeroprevalenceEstimate, AnimalMersViralEstimate, HumanMersSeroprevalenceEstimate, HumanMersViralEstimate, MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { isUNRegion, unRegionEnumToLabelMap } from "@/lib/un-regions";
import { isWHORegion } from "@/lib/who-regions";
import { chartTitlesForUnRegions, chartTitlesForWhoRegions } from "./summary-by-region";
import { UnRegion, WhoRegion } from "@/gql/graphql";
import { HumanSeroprevalenceByRegion } from "./estimates-by-region/human-seroprevalence-by-region";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { AnimalSeroprevalenceByRegion } from "./estimates-by-region/animal-seroprevalence-by-region";
import { HumanViralPositivePrevalenceByRegion } from "./estimates-by-region/human-viral-positive-prevalence-by-region";
import { AnimalViralPositivePrevalenceByRegion } from "./estimates-by-region/animal-viral-positive-prevalence-by-region";
import { distinctColoursMap, generateRandomColour } from "@/lib/utils";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";

export enum EstimatesByRegionVariableOfInterestDropdownOption {
  HUMAN_SEROPREVALENCE = "HUMAN_SEROPREVALENCE",
  ANIMAL_SEROPREVALENCE = "ANIMAL_SEROPREVALENCE",
  HUMAN_VIRAL_PREVALENCE = "HUMAN_VIRAL_PREVALENCE",
  ANIMAL_VIRAL_PREVALENCE = "ANIMAL_VIRAL_PREVALENCE",
}

export enum EstimatesByRegionRegionDropdownOption {
  WHO_REGION = "WHO_REGION",
  UN_REGION = "UN_REGION",
  COUNTRY = "COUNTRY"
}

interface EstimatesByRegionYAxisTickProps {
  tickProps: {
    x: number;
    y: number;
    payload: {
      value: number
    }
  }
  estimateNumberToEstimateNameMap: Record<string, Array<{ estimateName: string }>>
}

export const EstimatesByRegionYAxisTick = (props: EstimatesByRegionYAxisTickProps) => {
  const { estimateNumberToEstimateNameMap, tickProps } = props;
  const { x, y, payload } = tickProps;

  const estimateNumberString = payload.value.toString();

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={8}
        textAnchor="end"
        fill="#666"
      >
        {estimateNumberToEstimateNameMap[estimateNumberString]?.at(0)?.estimateName ?? 'Unknown Estimate Name'}
      </text>
    </g>
  );
}

interface EstimatesByRegionProps {
  humanMersSeroprevalenceEstimates: HumanMersSeroprevalenceEstimate[];
  animalMersSeroprevalenceEstimates: AnimalMersSeroprevalenceEstimate[];
  humanMersViralEstimates: HumanMersViralEstimate[];
  animalMersViralEstimates: AnimalMersViralEstimate[];
  barColoursForWhoRegions: Record<WhoRegion, string>;
  barColoursForUnRegions: Record<UnRegion, string>;
  selectedVariableOfInterest: EstimatesByRegionVariableOfInterestDropdownOption;
  selectedRegion: EstimatesByRegionRegionDropdownOption;
  legendConfiguration: LegendConfiguration;
}

export const EstimatesByRegion = (props: EstimatesByRegionProps) => {
  const {
    humanMersSeroprevalenceEstimates,
    animalMersSeroprevalenceEstimates,
    humanMersViralEstimates,
    animalMersViralEstimates,
    selectedVariableOfInterest,
    selectedRegion,
    barColoursForWhoRegions,
    barColoursForUnRegions,
    legendConfiguration
  } = props;

  const { countryAlphaTwoCodeToCountryNameMap } = useContext(CountryInformationContext);

  const regionGroupingFunction = useCallback((dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry) => {
    if(selectedRegion === EstimatesByRegionRegionDropdownOption.WHO_REGION) {
      if('primaryEstimateInfo' in dataPoint) {
        return dataPoint.primaryEstimateInfo.whoRegion;
      }

      return dataPoint.whoRegion;
    }
    if(selectedRegion === EstimatesByRegionRegionDropdownOption.UN_REGION) {
      if('primaryEstimateInfo' in dataPoint) {
        return dataPoint.primaryEstimateInfo.unRegion;
      }
      return dataPoint.unRegion;
    }

    if(selectedRegion === EstimatesByRegionRegionDropdownOption.COUNTRY) {
      if('primaryEstimateInfo' in dataPoint) {
        return dataPoint.primaryEstimateInfo.countryAlphaTwoCode;
      }

      return dataPoint.country.alphaTwoCode;
    }

    assertNever(selectedRegion);
  }, [ selectedRegion ]);

  const regionToDotColour = useCallback((region: WhoRegion | UnRegion | string, regionIndex: number) => {
    if(isWHORegion(region)) {
      return barColoursForWhoRegions[region];
    }

    if(isUNRegion(region)) {
      return barColoursForUnRegions[region];
    }

    const indexInDistinctColourMap = Math.floor((regionIndex * 3) / 32) + Math.floor(((regionIndex * 3) % 32)) + 1;
    const distinctColour = distinctColoursMap[indexInDistinctColourMap]

    if(distinctColour) {
      return distinctColour;
    }

    return generateRandomColour();
  }, [ barColoursForWhoRegions, barColoursForUnRegions ]);

  const regionToLegendLabel = useCallback((region: WhoRegion | UnRegion | string) => {
    if(isWHORegion(region)) {
      return chartTitlesForWhoRegions[region];
    }

    if(isUNRegion(region)) {
      return chartTitlesForUnRegions[region];
    }

    const countryName = countryAlphaTwoCodeToCountryNameMap[region];

    if(!!countryName) {
      return countryName;
    }

    return region;
  }, [ countryAlphaTwoCodeToCountryNameMap ]);

  const graph = useMemo(() => {
    if(selectedVariableOfInterest === EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE) {
      return <HumanSeroprevalenceByRegion
        humanMersSeroprevalenceEstimates={humanMersSeroprevalenceEstimates}
        regionGroupingFunction={regionGroupingFunction}
        regionToDotColour={regionToDotColour}
        regionToLegendLabel={regionToLegendLabel}
        legendConfiguration={legendConfiguration}
      />
    }
    if(selectedVariableOfInterest === EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_VIRAL_PREVALENCE) {
      return <HumanViralPositivePrevalenceByRegion
        humanMersViralEstimates={humanMersViralEstimates}
        regionGroupingFunction={regionGroupingFunction}
        regionToDotColour={regionToDotColour}
        regionToLegendLabel={regionToLegendLabel}
        legendConfiguration={legendConfiguration}
      />
    }
    if(selectedVariableOfInterest === EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE) {
      return <AnimalSeroprevalenceByRegion
        animalMersSeroprevalenceEstimates={animalMersSeroprevalenceEstimates}
        regionGroupingFunction={regionGroupingFunction}
        regionToDotColour={regionToDotColour}
        regionToLegendLabel={regionToLegendLabel}
        legendConfiguration={legendConfiguration}
      />
    }
    if(selectedVariableOfInterest === EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_VIRAL_PREVALENCE) {
      return <AnimalViralPositivePrevalenceByRegion
        animalMersViralEstimates={animalMersViralEstimates}
        regionGroupingFunction={regionGroupingFunction}
        regionToDotColour={regionToDotColour}
        regionToLegendLabel={regionToLegendLabel}
        legendConfiguration={legendConfiguration}
      />
    }
    assertNever(selectedVariableOfInterest);
  }, [ humanMersSeroprevalenceEstimates, animalMersSeroprevalenceEstimates, humanMersViralEstimates, animalMersViralEstimates, selectedVariableOfInterest, regionGroupingFunction, regionToDotColour, regionToLegendLabel, legendConfiguration ]);

  return graph;
}