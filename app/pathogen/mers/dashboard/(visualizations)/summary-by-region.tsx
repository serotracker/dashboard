import { useMemo, useCallback, useContext } from "react";
import assertNever from "assert-never";
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { HumanCasesSummaryByRegion } from "./summary-by-region/human-cases-summary-by-region";
import { HumanSeroprevalenceSummaryByRegion } from "./summary-by-region/human-seroprevalence-summary-by-region";
import { AnimalCasesSummaryByRegion } from "./summary-by-region/animal-cases-summary-by-region";
import { HumanDeathsSummaryByRegion } from "./summary-by-region/human-deaths-summary-by-region";
import { UnRegion, WhoRegion } from "@/gql/graphql";
import { isUNRegion, unRegionEnumToLabelMap } from "@/lib/un-regions";
import { isWHORegion } from "@/lib/who-regions";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";
import { AnimalSeroprevalenceSummaryByRegion } from "./summary-by-region/animal-seroprevalence-by-region";
import { HumanViralPositivePrevalenceSummaryByRegion } from "./summary-by-region/human-viral-positive-prevalence-by-region";
import { AnimalViralPositivePrevalenceSummaryByRegion } from "./summary-by-region/animal-viral-positive-prevalence-by-region";
import { distinctColoursMap } from "@/lib/utils";
import { MersMacroSampleFramesContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-macro-sample-frames-context";

export enum SummaryByRegionVariableOfInterestDropdownOption {
  HUMAN_MEDIAN_SEROPREVALENCE = "HUMAN_MEDIAN_SEROPREVALENCE",
  ANIMAL_MEDIAN_SEROPREVALENCE = "ANIMAL_MEDIAN_SEROPREVALENCE",
  HUMAN_MEDIAN_VIRAL_PREVALENCE = "HUMAN_MEDIAN_VIRAL_PREVALENCE",
  ANIMAL_MEDIAN_VIRAL_PREVALENCE = "ANIMAL_MEDIAN_VIRAL_PREVALENCE",
  MERS_ANIMAL_CASES = "MERS_ANIMAL_CASES",
  MERS_HUMAN_CASES = "MERS_HUMAN_CASES",
  MERS_HUMAN_DEATHS = "MERS_HUMAN_DEATHS",
}

export enum SummaryByRegionRegionDropdownOption {
  WHO_REGION = "WHO_REGION",
  UN_REGION = "UN_REGION",
  COUNTRY = "COUNTRY",
}

interface SummaryByRegionProps {
  barColoursForWhoRegions: Record<WhoRegion, string>;
  barColoursForUnRegions: Record<UnRegion, string>;
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  selectedVariableOfInterest: SummaryByRegionVariableOfInterestDropdownOption;
  selectedRegion: SummaryByRegionRegionDropdownOption;
  selectedAnimalSampleFrameOrMacroSampleFrame: string | undefined;
  numberOfPagesAvailable: number;
  setNumberOfPagesAvailable: (newNumberOfPagesAvailable: number) => void;
  currentPageIndex: number;
}

export const chartTitlesForWhoRegions: Record<WhoRegion, string> = {
  [WhoRegion.Afr]: "AFR",
  [WhoRegion.Amr]: "AMR",
  [WhoRegion.Emr]: "EMR",
  [WhoRegion.Eur]: "EUR",
  [WhoRegion.Sear]: "SEAR",
  [WhoRegion.Wpr]: "WPR",
};


export const chartTitlesForUnRegions = unRegionEnumToLabelMap;

const variableOfInterestToBarColourMap = {
  [SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE]: "#93c5fd",
  [SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_SEROPREVALENCE]: "#6ee7b7",
  [SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_VIRAL_PREVALENCE]: "#3b82f6",
  [SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_VIRAL_PREVALENCE]: "#22c55e",
  [SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES]: "#15803d",
  [SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES]: "#1d4ed8",
  [SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS]: "#1e40af",
}

export const SummaryByRegion = (props: SummaryByRegionProps) => {
  const {
    data,
    selectedVariableOfInterest,
    selectedRegion,
    selectedAnimalSampleFrameOrMacroSampleFrame,
    setNumberOfPagesAvailable,
    currentPageIndex,
    barColoursForWhoRegions,
    barColoursForUnRegions
  } = props;

  const { countryAlphaTwoCodeToCountryNameMap } = useContext(CountryInformationContext);
  const { macroSampleFrames } = useContext(MersMacroSampleFramesContext)

  const regionGroupingFunction = useCallback((dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry) => {
    if(selectedRegion === SummaryByRegionRegionDropdownOption.WHO_REGION) {
      if('primaryEstimateInfo' in dataPoint) {
        return dataPoint.primaryEstimateInfo.whoRegion;
      }

      return dataPoint.whoRegion;
    }
    if(selectedRegion === SummaryByRegionRegionDropdownOption.UN_REGION) {
      if('primaryEstimateInfo' in dataPoint) {
        return dataPoint.primaryEstimateInfo.unRegion;
      }

      return dataPoint.unRegion;
    }
    if(selectedRegion === SummaryByRegionRegionDropdownOption.COUNTRY) {
      if('primaryEstimateInfo' in dataPoint) {
        return dataPoint.primaryEstimateInfo.countryAlphaTwoCode;
      }

      return dataPoint.country.alphaTwoCode;
    }
    assertNever(selectedRegion);
  }, [ selectedRegion ]);

  const regionToBarColour = useCallback((region: string, regionIndex: number) => {
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

    return variableOfInterestToBarColourMap[selectedVariableOfInterest];
  }, [ selectedVariableOfInterest, barColoursForWhoRegions, barColoursForUnRegions ]);

  const regionToChartTitle = useCallback((region: string) => {
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
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE) {
      return <HumanSeroprevalenceSummaryByRegion
        data={data}
        regionGroupingFunction={(dataPoint) => regionGroupingFunction(dataPoint) ?? undefined}
        selectedSampleFrames={selectedAnimalSampleFrameOrMacroSampleFrame
          ? macroSampleFrames
            .filter((macroSampleFrame) => macroSampleFrame.macroSampleFrame === selectedAnimalSampleFrameOrMacroSampleFrame)
            .flatMap((macroSampleFrame) => macroSampleFrame.sampleFrames)
          : []
        }
        regionToBarColour={(region, regionIndex) => regionToBarColour(region, regionIndex)}
        regionToChartTitle={(region) => regionToChartTitle(region)}
        setNumberOfPagesAvailable={setNumberOfPagesAvailable}
        currentPageIndex={currentPageIndex}
      />
    }
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_VIRAL_PREVALENCE) {
      return <HumanViralPositivePrevalenceSummaryByRegion
        data={data}
        regionGroupingFunction={(dataPoint) => regionGroupingFunction(dataPoint) ?? undefined}
        selectedSampleFrames={selectedAnimalSampleFrameOrMacroSampleFrame
          ? macroSampleFrames
            .filter((macroSampleFrame) => macroSampleFrame.macroSampleFrame === selectedAnimalSampleFrameOrMacroSampleFrame)
            .flatMap((macroSampleFrame) => macroSampleFrame.sampleFrames)
          : []
        }
        regionToBarColour={(region, regionIndex) => regionToBarColour(region, regionIndex)}
        regionToChartTitle={(region) => regionToChartTitle(region)}
        setNumberOfPagesAvailable={setNumberOfPagesAvailable}
        currentPageIndex={currentPageIndex}
      />
    }
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_SEROPREVALENCE) {
      return <AnimalSeroprevalenceSummaryByRegion
        data={data}
        regionGroupingFunction={(dataPoint) => regionGroupingFunction(dataPoint) ?? undefined}
        selectedAnimalSampleFrame={selectedAnimalSampleFrameOrMacroSampleFrame}
        regionToBarColour={(region, regionIndex) => regionToBarColour(region, regionIndex)}
        regionToChartTitle={(region) => regionToChartTitle(region)}
        setNumberOfPagesAvailable={setNumberOfPagesAvailable}
        currentPageIndex={currentPageIndex}
      />
    }
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_VIRAL_PREVALENCE) {
      return <AnimalViralPositivePrevalenceSummaryByRegion
        data={data}
        regionGroupingFunction={(dataPoint) => regionGroupingFunction(dataPoint) ?? undefined}
        selectedAnimalSampleFrame={selectedAnimalSampleFrameOrMacroSampleFrame}
        regionToBarColour={(region, regionIndex) => regionToBarColour(region, regionIndex)}
        regionToChartTitle={(region) => regionToChartTitle(region)}
        setNumberOfPagesAvailable={setNumberOfPagesAvailable}
        currentPageIndex={currentPageIndex}
      />
    }
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES) {
      return <AnimalCasesSummaryByRegion
        data={data}
        regionGroupingFunction={(dataPoint) => regionGroupingFunction(dataPoint) ?? undefined}
        regionToBarColour={(region, regionIndex) => regionToBarColour(region, regionIndex)}
        regionToChartTitle={(region) => regionToChartTitle(region)}
        setNumberOfPagesAvailable={setNumberOfPagesAvailable}
        currentPageIndex={currentPageIndex}
      />
    }
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES) {
      return <HumanCasesSummaryByRegion
        data={data}
        regionGroupingFunction={(dataPoint) => regionGroupingFunction(dataPoint) ?? undefined}
        regionToBarColour={(region, regionIndex) => regionToBarColour(region, regionIndex)}
        regionToChartTitle={(region) => regionToChartTitle(region)}
        setNumberOfPagesAvailable={setNumberOfPagesAvailable}
        currentPageIndex={currentPageIndex}
      />
    }
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS) {
      return <HumanDeathsSummaryByRegion
        data={data}
        regionGroupingFunction={(dataPoint) => regionGroupingFunction(dataPoint) ?? undefined}
        regionToBarColour={(region, regionIndex) => regionToBarColour(region, regionIndex)}
        regionToChartTitle={(region) => regionToChartTitle(region)}
        setNumberOfPagesAvailable={setNumberOfPagesAvailable}
        currentPageIndex={currentPageIndex}
      />
    }

    assertNever(selectedVariableOfInterest);
  }, [ data, selectedVariableOfInterest, regionGroupingFunction, setNumberOfPagesAvailable, currentPageIndex, regionToBarColour, regionToChartTitle, selectedAnimalSampleFrameOrMacroSampleFrame, macroSampleFrames ]);

  return graph;
}