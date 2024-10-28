import { useContext } from "react";
import { LegendConfiguration, StackedBarChart } from "@/components/customs/visualizations/stacked-bar-chart";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { convertArboSFtoArbo } from "./recharts";
import { sortArboviruses } from "./rechart-utils";
import { generateRandomColour } from "@/lib/utils";
import { ArbovirusAvailablePathogensContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-available-pathogens-context";

interface EstimateCountByArbovirusAndAntibodyTypeGraphProps {
  legendConfiguration: LegendConfiguration;
}

const barColoursForAntibodies: Record<string, string | undefined> = {
  "IgG": "#61f4de",
  "IgM": "#65cbe9",
  "IgG, IgM": "#6cb6ef",
  "NAb": "#6c8dfa",
  "S segment (OROV only)": "#218dad",
  "N Segment": "#09b1e3"
};

export const EstimateCountByArbovirusAndAntibodyTypeGraph = (props: EstimateCountByArbovirusAndAntibodyTypeGraphProps) => {
  const state = useContext(ArboContext);
  const { availablePathogens } = useContext(ArbovirusAvailablePathogensContext);

  return (
    <StackedBarChart
      graphId='estimate-count-by-arbovirus-and-antibody-type-graph'
      data={state.filteredData
        .map((dataPoint) => ({...dataPoint, antibodyKey: dataPoint.antibodies.sort((antibodyA: string, antibodyB: string) => antibodyA > antibodyB ? 1 : -1).join(', ')}))
        .filter((dataPoint) => !!dataPoint.antibodyKey)}
      primaryGroupingFunction={(dataPoint) => convertArboSFtoArbo(dataPoint.pathogen)}
      primaryGroupingSortFunction={sortArboviruses}
      secondaryGroupingFunction={(dataPoint) => dataPoint.antibodyKey}
      secondaryGroupingSortFunction={(antibodyKeyA, antibodyKeyB) => antibodyKeyA > antibodyKeyB ? 1 : -1}
      transformOutputValue={({ data }) => data.length}
      legendConfiguration={props.legendConfiguration}
      getBarColour={(antibodyKey) => barColoursForAntibodies[antibodyKey] ?? generateRandomColour()}
      xAxisTickSettings={(process.env.NEXT_PUBLIC_OROPOUCHE_ENABLED === 'true' && availablePathogens.length > 6) ? {
        idealMaximumCharactersPerLine: 5,
        fontSize: "10px",
        lineHeight: 10
      } : {
        idealMaximumCharactersPerLine: 5
      }}
    />
  );
}