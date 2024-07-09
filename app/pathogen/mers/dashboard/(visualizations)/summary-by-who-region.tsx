import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { ReportedEventsOverTimeByWhoRegion } from "./reported-events-over-time-by-who-region";

interface SummaryByWhoRegionProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
}

export const SummaryByWhoRegion = (props: SummaryByWhoRegionProps) => {
  return <ReportedEventsOverTimeByWhoRegion data={props.data}/>
}