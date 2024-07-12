import { useMemo, useCallback, useContext } from "react";
import assertNever from "assert-never";
import defaultColours from 'tailwindcss/colors'
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { HumanCasesSummaryByRegion } from "./summary-by-region/human-cases-summary-by-region";
import { SeroprevalenceSummaryByRegion } from "./summary-by-region/seroprevalence-summary-by-region";
import { AnimalCasesSummaryByRegion } from "./summary-by-region/animal-cases-summary-by-region";
import { HumanDeathsSummaryByRegion } from "./summary-by-region/human-deaths-summary-by-region";
import { UnRegion, WhoRegion } from "@/gql/graphql";
import { isUNRegion, unRegionEnumToLabelMap } from "@/lib/un-regions";
import { isWHORegion } from "@/lib/who-regions";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";

export enum SummaryByRegionVariableOfInterestDropdownOption {
  MEDIAN_SEROPREVALENCE = "MEDIAN_SEROPREVALENCE",
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
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  selectedVariableOfInterest: SummaryByRegionVariableOfInterestDropdownOption;
  selectedRegion: SummaryByRegionRegionDropdownOption;
  numberOfPagesAvailable: number;
  setNumberOfPagesAvailable: (newNumberOfPagesAvailable: number) => void;
  currentPageIndex: number;
}

const barColoursForWhoRegions: Record<WhoRegion, string> = {
  [WhoRegion.Afr]: "#e15759",
  [WhoRegion.Amr]: "#59a14f",
  [WhoRegion.Emr]: "#f1ce63",
  [WhoRegion.Eur]: "#f28e2b",
  [WhoRegion.Sear]: "#d37295",
  [WhoRegion.Wpr]: "#4e79a7",
};

const chartTitlesForWhoRegions: Record<WhoRegion, string> = {
  [WhoRegion.Afr]: "AFR",
  [WhoRegion.Amr]: "AMR",
  [WhoRegion.Emr]: "EMR",
  [WhoRegion.Eur]: "EUR",
  [WhoRegion.Sear]: "SEAR",
  [WhoRegion.Wpr]: "WPR",
};

const barColoursForUnRegions: Record<UnRegion, string> = {
  [UnRegion.AustraliaAndNewZealand]: defaultColours.amber[200],
  [UnRegion.Caribbean]: defaultColours.fuchsia[200],
  [UnRegion.CentralAmerica]: defaultColours.blue[200],
  [UnRegion.CentralAsia]: defaultColours.purple[200],
  [UnRegion.EasternAfrica]: defaultColours.emerald[200],
  [UnRegion.EasternAsia]: defaultColours.rose[200],
  [UnRegion.EasternEurope]: defaultColours.orange[200],
  [UnRegion.Melanesia]: defaultColours.lime[200],
  [UnRegion.Micronesia]: defaultColours.red[200],
  [UnRegion.MiddleAfrica]: defaultColours.teal[200],
  [UnRegion.NorthernAfrica]: defaultColours.indigo[200],
  [UnRegion.NorthernAmerica]: defaultColours.amber[400],
  [UnRegion.NorthernEurope]: defaultColours.fuchsia[400],
  [UnRegion.Polynesia]: defaultColours.blue[400],
  [UnRegion.SouthernAfrica]: defaultColours.purple[400],
  [UnRegion.SouthernAsia]: defaultColours.emerald[400],
  [UnRegion.SouthernEurope]: defaultColours.rose[400],
  [UnRegion.SouthAmerica]: defaultColours.orange[400],
  [UnRegion.SouthEasternAsia]: defaultColours.lime[400],
  [UnRegion.WesternAfrica]: defaultColours.red[400],
  [UnRegion.WesternAsia]: defaultColours.teal[400],
  [UnRegion.WesternEurope]: defaultColours.indigo[400]
}

const chartTitlesForUnRegions = unRegionEnumToLabelMap;

const variableOfInterestToBarColourMap = {
  [SummaryByRegionVariableOfInterestDropdownOption.MEDIAN_SEROPREVALENCE]: "#e7ed8a",
  [SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES]: "#ed8ac7",
  [SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES]: "#8abded",
  [SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS]: "#2a8deb",
}

export const SummaryByRegion = (props: SummaryByRegionProps) => {
  const {
    data,
    selectedVariableOfInterest,
    selectedRegion,
    setNumberOfPagesAvailable,
    currentPageIndex,
  } = props;

  const { countryAlphaTwoCodeToCountryNameMap } = useContext(CountryInformationContext);

  const regionGroupingFunction = useCallback((dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry) => {
    if(selectedRegion === SummaryByRegionRegionDropdownOption.WHO_REGION) {
      return dataPoint.whoRegion;
    }
    if(selectedRegion === SummaryByRegionRegionDropdownOption.UN_REGION) {
      return dataPoint.unRegion;
    }
    if(selectedRegion === SummaryByRegionRegionDropdownOption.COUNTRY) {
      if(dataPoint.__typename === 'MersEstimate') {
        return dataPoint.countryAlphaTwoCode;
      }

      return dataPoint.country.alphaTwoCode;
    }
    assertNever(selectedRegion);
  }, [ selectedRegion ]);

  const regionToBarColour = useCallback((region: string) => {
    if(isWHORegion(region)) {
      return barColoursForWhoRegions[region];
    }
    if(isUNRegion(region)) {
      return barColoursForUnRegions[region];
    }

    return variableOfInterestToBarColourMap[selectedVariableOfInterest];
  }, [ selectedVariableOfInterest ]);

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
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.MEDIAN_SEROPREVALENCE) {
      return <SeroprevalenceSummaryByRegion
        data={data}
        regionGroupingFunction={(dataPoint) => regionGroupingFunction(dataPoint) ?? undefined}
        regionToBarColour={(region) => regionToBarColour(region)}
        regionToChartTitle={(region) => regionToChartTitle(region)}
        setNumberOfPagesAvailable={setNumberOfPagesAvailable}
        currentPageIndex={currentPageIndex}
      />
    }
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES) {
      return <AnimalCasesSummaryByRegion
        data={data}
        regionGroupingFunction={(dataPoint) => regionGroupingFunction(dataPoint) ?? undefined}
        regionToBarColour={(region) => regionToBarColour(region)}
        regionToChartTitle={(region) => regionToChartTitle(region)}
        setNumberOfPagesAvailable={setNumberOfPagesAvailable}
        currentPageIndex={currentPageIndex}
      />
    }
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES) {
      return <HumanCasesSummaryByRegion
        data={data}
        regionGroupingFunction={(dataPoint) => regionGroupingFunction(dataPoint) ?? undefined}
        regionToBarColour={(region) => regionToBarColour(region)}
        regionToChartTitle={(region) => regionToChartTitle(region)}
        setNumberOfPagesAvailable={setNumberOfPagesAvailable}
        currentPageIndex={currentPageIndex}
      />
    }
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS) {
      return <HumanDeathsSummaryByRegion
        data={data}
        regionGroupingFunction={(dataPoint) => regionGroupingFunction(dataPoint) ?? undefined}
        regionToBarColour={(region) => regionToBarColour(region)}
        regionToChartTitle={(region) => regionToChartTitle(region)}
        setNumberOfPagesAvailable={setNumberOfPagesAvailable}
        currentPageIndex={currentPageIndex}
      />
    }

    assertNever(selectedVariableOfInterest);
  }, [ data, selectedVariableOfInterest, regionGroupingFunction, setNumberOfPagesAvailable, currentPageIndex, regionToBarColour, regionToChartTitle ]);

  return graph;
}