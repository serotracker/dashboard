import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { useMemo } from "react";
import { HumanCasesSummaryByWhoRegion } from "./summary-by-who-region/human-cases-summary-by-who-region";
import { SeroprevalenceSummaryByWhoRegion } from "./summary-by-who-region/seroprevalence-summary-by-who-region";
import { AnimalCasesSummaryByWhoRegion } from "./summary-by-who-region/animal-cases-summary-by-who-region";
import assertNever from "assert-never";
import { HumanDeathsSummaryByWhoRegion } from "./summary-by-who-region/human-deaths-summary-by-who-region";

export enum SummaryByWhoRegionDropdownOption {
  SEROPREVALENCE_ESTIMATES = "SEROPREVALENCE_ESTIMATES",
  MERS_ANIMAL_CASES = "MERS_ANIMAL_CASES",
  MERS_HUMAN_CASES = "MERS_HUMAN_CASES",
  MERS_HUMAN_DEATHS = "MERS_HUMAN_DEATHS",
}

interface SummaryByWhoRegionProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  selectedDropdownOption: SummaryByWhoRegionDropdownOption;
}

export const SummaryByWhoRegion = (props: SummaryByWhoRegionProps) => {
  const { data, selectedDropdownOption } = props;

  const graph = useMemo(() => {
    if(selectedDropdownOption === SummaryByWhoRegionDropdownOption.SEROPREVALENCE_ESTIMATES) {
      return <SeroprevalenceSummaryByWhoRegion data={data}/>
    }
    if(selectedDropdownOption === SummaryByWhoRegionDropdownOption.MERS_ANIMAL_CASES) {
      return <AnimalCasesSummaryByWhoRegion data={data}/>
    }
    if(selectedDropdownOption === SummaryByWhoRegionDropdownOption.MERS_HUMAN_CASES) {
      return <HumanCasesSummaryByWhoRegion data={data}/>
    }
    if(selectedDropdownOption === SummaryByWhoRegionDropdownOption.MERS_HUMAN_DEATHS) {
      return <HumanDeathsSummaryByWhoRegion data={data}/>
    }

    assertNever(selectedDropdownOption);
  }, [ data, selectedDropdownOption ]);

  return graph;
}