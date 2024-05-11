import { AreaChart } from "@/components/customs/visualizations/area-chart";
import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { generateRandomColour } from "@/lib/utils";
import { useContext } from "react";

interface GenerateTimeBucketForEstimateInput {
  estimate: SarsCov2Estimate;
}

const generateTimeBucketForEstimate = (input: GenerateTimeBucketForEstimateInput): string => {
  return 'ABC123';
}

const barColoursForPopulationGroups: Record<string, string | undefined> = {
  "Assisted living and long-term care facilities": "#bae3b1",
  "Blood donors": "#c6e0f1",
  "Contacts of COVID patients": "#b6d7d3",
  "Essential non-healthcare workers": "#e5aabf",
  "Family of essential workers": "#e7d3ca",
  "Health care workers and caregivers": "#d6d0cd",
  "Hospital visitors": "#ed9a9b",
  "Household and community samples": "#f7bb80",
  "Multiple general populations": "#ffd8b1",
  "Multiple populations": "#9bc795",
  "Non-essential workers and unemployed persons": "#fcd9e4",
  "Patients seeking care for non-COVID-19 reasons": "#afa9a8",
  "Perinatal": "#d0afc7",
  "Persons experiencing homelessness": "#92c1bf",
  "Persons living in slums": "#d3c281",
  "Persons who are incarcerated": "#f7e2a1",
  "Pregnant or parturient women": "#e5cade",
  "Representative patient population": "#ffc4c2",
  "Residual sera": "#95afca",
  "Students and Daycares": "#c4ada0"
};

export const CumulativeNumberOfSerosurveysPublishedOverTime = () => {
  const state = useContext(SarsCov2Context);

  return (
    <AreaChart
      graphId="cumulative-number-of-sc2-serosurveys-published-over-time"
      data={state.filteredData.filter((dataPoint: SarsCov2Estimate): dataPoint is Omit<SarsCov2Estimate, "populationGroup">
        & {
          populationGroup: NonNullable<SarsCov2Estimate["populationGroup"]>;
        } => !!dataPoint.populationGroup
      )}
      primaryGroupingFunction={(dataPoint) => generateTimeBucketForEstimate({ estimate: dataPoint })}
      secondaryGroupingFunction={(dataPoint) => dataPoint.populationGroup}
      transformOutputValue={(data) => data.length}
      getBarColour={(populationGroup) => barColoursForPopulationGroups[populationGroup] ?? generateRandomColour()}
    />
  );
};
