import { useContext } from "react";
import { LegendConfiguration, StackedBarChart } from "@/components/customs/visualizations/stacked-bar-chart";
import { convertArboSFtoArbo } from "./recharts";
import { sortArboviruses } from "./rechart-utils";
import { generateRandomColour } from "@/lib/utils";
import { ArbovirusAvailablePathogensContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-available-pathogens-context";
import { useGroupedArbovirusEstimateData } from "../../use-arbo-primary-estimate-data";

interface EstimateCountByArbovirusAndAntibodyTypeGraphProps {
  legendConfiguration: LegendConfiguration;
}

const barColoursForAntibodies: Record<string, string | undefined> = {
  "NAb": "#61f4de",
  "IgG": "#65cbe9",
  "IgM": "#6cb6ef",
  "IgG;IgM": "#6c8dfa",
  "Total Ig": "#218dad",
  "IgG;NAb": "#09b1e3",
  "IgM;NAb": "#4b99f2",
  "Other": "#2aa5eb",
};

const possibleAntibodiesForGraph = [
  "NAb",
  "IgG",
  "IgM",
  "IgG;IgM",
  "Total Ig",
  "IgG;NAb",
  "IgM;NAb",
  "Other",
] as const;

export type PossibleAntibodyForGraph = typeof possibleAntibodiesForGraph[number];

const isPossibleAntibodyForGraph = (antibody: string): antibody is PossibleAntibodyForGraph => {
  return possibleAntibodiesForGraph.some((element) => element === antibody);
}

const sortOrderForPossibleAntibodiesForGraph: Record<PossibleAntibodyForGraph, number> = {
  "IgG": 1,
  "IgG;IgM": 2,
  "IgG;NAb": 3,
  "IgM": 4,
  "IgM;NAb": 5,
  "NAb": 6,
  "Other": 7,
  "Total Ig": 8,
}

export const sortPossibleAntibodiesForGraph = (antibodyA: PossibleAntibodyForGraph, antibodyB: PossibleAntibodyForGraph): number => {
  return sortOrderForPossibleAntibodiesForGraph[antibodyA] - sortOrderForPossibleAntibodiesForGraph[antibodyB];
}

interface GenerateAntibodyForGraphInput {
  antibodies: string[];
}

interface GenerateAntibodyForGraphOutput {
  antibody: PossibleAntibodyForGraph | undefined;
}

export const generateAntibodyForGraph = (
  input: GenerateAntibodyForGraphInput
): GenerateAntibodyForGraphOutput => {
  const { antibodies } = input;

  const cleanedAntibodies = antibodies
    .map((antibody) => antibody.endsWith('-capture') && antibody.length > 8 ? antibody.slice(0, -8) : antibody)
    .filter((antibody, index, array) => array.indexOf(antibody) === index)
    .sort((antibodyA, antibodyB) => antibodyA > antibodyB ? 1 : -1);

  if(cleanedAntibodies.length === 0) {
    return {
      antibody: undefined,
    }
  }

  if(cleanedAntibodies.length > 2) {
    return {
      antibody: 'Other',
    }
  }

  const antibody = cleanedAntibodies.join(';');

  if(!isPossibleAntibodyForGraph(antibody)) {
    return {
      antibody: 'Other',
    }
  }

  return {
    antibody,
  }
}

export const EstimateCountByArbovirusAndAntibodyTypeGraph = (props: EstimateCountByArbovirusAndAntibodyTypeGraphProps) => {
  const { primaryEstimateData: state } = useGroupedArbovirusEstimateData();
  const { availablePathogens } = useContext(ArbovirusAvailablePathogensContext);

  return (
    <StackedBarChart
      graphId='estimate-count-by-arbovirus-and-antibody-type-graph'
      data={state.filteredData
        .map((dataPoint) => ({
          ...dataPoint,
          antibodyKey: generateAntibodyForGraph({ antibodies: dataPoint.antibodies }).antibody
        }))
        .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'antibodyKey'> & {
          antibodyKey: NonNullable<typeof dataPoint['antibodyKey']>
        } => !!dataPoint.antibodyKey)
      }
      primaryGroupingFunction={(dataPoint) => convertArboSFtoArbo(dataPoint.pathogen)}
      primaryGroupingSortFunction={sortArboviruses}
      secondaryGroupingFunction={(dataPoint) => dataPoint.antibodyKey}
      secondaryGroupingSortFunction={(antibodyKeyA, antibodyKeyB) => sortPossibleAntibodiesForGraph(antibodyKeyA, antibodyKeyB)}
      transformOutputValue={({ data }) => data.length}
      legendConfiguration={props.legendConfiguration}
      getBarColour={(antibodyKey) => barColoursForAntibodies[antibodyKey] ?? generateRandomColour()}
      xAxisTickSettings={(process.env.NEXT_PUBLIC_OROPOUCHE_ENABLED === 'true' && availablePathogens.length > 3) ? {
        idealMaximumCharactersPerLine: 5,
        fontSize: "10px",
        lineHeight: 10
      } : {
        idealMaximumCharactersPerLine: 5
      }}
    />
  );
}