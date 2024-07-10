import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { useMemo } from "react";
import { HumanCasesSummaryByWhoRegion } from "./summary-by-who-region/human-cases-summary-by-who-region";
import { SeroprevalenceSummaryByWhoRegion } from "./summary-by-who-region/seroprevalence-summary-by-who-region";
import { AnimalCasesSummaryByWhoRegion } from "./summary-by-who-region/animal-cases-summary-by-who-region";
import assertNever from "assert-never";
import { HumanDeathsSummaryByWhoRegion } from "./summary-by-who-region/human-deaths-summary-by-who-region";

export enum SummaryByRegionVariableOfInterestDropdownOption {
  MEDIAN_SEROPREVALENCE = "MEDIAN_SEROPREVALENCE",
  MERS_ANIMAL_CASES = "MERS_ANIMAL_CASES",
  MERS_HUMAN_CASES = "MERS_HUMAN_CASES",
  MERS_HUMAN_DEATHS = "MERS_HUMAN_DEATHS",
}

export enum SummaryByRegionRegionDropdownOption {
  WHO_REGION = "WHO_REGION",
  UN_REGION = "UN_REGION"
}

interface SummaryByRegionProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  selectedVariableOfInterest: SummaryByRegionVariableOfInterestDropdownOption;
  selectedRegion: SummaryByRegionRegionDropdownOption;
}

export const SummaryByRegion = (props: SummaryByRegionProps) => {
  const { data, selectedVariableOfInterest } = props;

  const graph = useMemo(() => {
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.MEDIAN_SEROPREVALENCE) {
      return <SeroprevalenceSummaryByWhoRegion data={data}/>
    }
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES) {
      return <AnimalCasesSummaryByWhoRegion data={data}/>
    }
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES) {
      return <HumanCasesSummaryByWhoRegion data={data}/>
    }
    if(selectedVariableOfInterest === SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS) {
      return <HumanDeathsSummaryByWhoRegion data={data}/>
    }

    assertNever(selectedVariableOfInterest);
  }, [ data, selectedVariableOfInterest ]);

  return graph;
}