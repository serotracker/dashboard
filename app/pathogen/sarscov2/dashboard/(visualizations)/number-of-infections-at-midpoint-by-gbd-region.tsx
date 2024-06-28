import { useMemo } from 'react';
import { AreaChart } from "@/components/customs/visualizations/area-chart";
import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { generateRandomColour, generateRange } from "@/lib/utils";
import { useContext } from "react";
import { GbdSuperRegion } from "@/gql/graphql";
import { gbdSuperRegionToLabelMap } from '@/lib/gbd-regions';
import { MonthlySarsCov2CountryInformationContext } from '@/contexts/pathogen-context/pathogen-contexts/monthly-sarscov2-country-information-context';
import { pipe } from "fp-ts/lib/function.js";
import { LineChart } from '@/components/customs/visualizations/line-chart';
import { LegendConfiguration } from '@/components/customs/visualizations/stacked-bar-chart';

const barColoursForGbdSuperRegions: Record<GbdSuperRegion, string> = {
  [GbdSuperRegion.CentralEuropeEasternEuropeAndCentralAsia]: "#e15759",
  [GbdSuperRegion.HighIncome]: "#59a14f",
  [GbdSuperRegion.LatinAmericaAndCaribbean]: "#f1ce63",
  [GbdSuperRegion.NorthAfricaAndMiddleEast]: "#f28e2b",
  [GbdSuperRegion.SouthAsia]: "#d37295",
  [GbdSuperRegion.SouthEastAsiaEastAsiaAndOceania]: "#4e79a7",
  [GbdSuperRegion.SubSaharanAfrica]: "#8b5cf6",
};

type EligibleSarsCov2EstimateForVisualization = Omit<SarsCov2Estimate, "gbdSuperRegion"|"seroprevalence"|"countryPositiveCasesPerMillionPeople"> & {
  gbdSuperRegion: NonNullable<SarsCov2Estimate["gbdSuperRegion"]>;
  seroprevalence: NonNullable<SarsCov2Estimate["seroprevalence"]>;
  countryPositiveCasesPerMillionPeople: NonNullable<SarsCov2Estimate["countryPositiveCasesPerMillionPeople"]>;
}

interface GenerateExactRatiosInput {
  dataPoints: EligibleSarsCov2EstimateForVisualization[]
}

interface GenerateExactRatiosOutput {
  dataPoints: Array<EligibleSarsCov2EstimateForVisualization & { exactRatio: number }>
}

const generateExactRatios = (input: GenerateExactRatiosInput): GenerateExactRatiosOutput => {
  return {
    dataPoints: input.dataPoints
      .map((dataPoint) => ({
        ...dataPoint,
        exactRatio: (dataPoint.seroprevalence) / (dataPoint.countryPositiveCasesPerMillionPeople / 1_000_000)
      }))
  }
}

type GenerateRatioBucketsInput = GenerateExactRatiosOutput;

interface GenerateRatioBucketsOutput {
  dataPoints: Array<EligibleSarsCov2EstimateForVisualization & { exactRatio: number }>
  ratioBuckets: string[];
}

const generateRatioBuckets = (input: GenerateRatioBucketsInput): GenerateRatioBucketsOutput => {
  if(input.dataPoints.length === 0) {
    return { dataPoints: input.dataPoints, ratioBuckets: [] };
  }

  const sortedExactRatiosAscending = input.dataPoints.sort((a, b) => a.exactRatio - b.exactRatio);
  const smallestExactRatio = sortedExactRatiosAscending.at(0)?.exactRatio ?? 0;
  const largestExactRatio = sortedExactRatiosAscending.at(-1)?.exactRatio ?? 0;

  const smallestOrderOfMagnitude = Math.floor(Math.log(smallestExactRatio))
  const largestOrderOfMagnitude = Math.floor(Math.log(largestExactRatio))

  const allOrdersOfMagnitude = generateRange({
    startInclusive: smallestOrderOfMagnitude,
    endInclusive: largestOrderOfMagnitude,
    stepSize: 1
  })

  return {
    dataPoints: input.dataPoints,
    ratioBuckets: allOrdersOfMagnitude.flatMap((orderOfMagnitude) => [
      (1 * (Math.pow(10, orderOfMagnitude))).toFixed(orderOfMagnitude < 0 ? Math.abs(orderOfMagnitude) : 0),
      (2 * (Math.pow(10, orderOfMagnitude))).toFixed(orderOfMagnitude < 0 ? Math.abs(orderOfMagnitude) : 0),
      (5 * (Math.pow(10, orderOfMagnitude))).toFixed(orderOfMagnitude < 0 ? Math.abs(orderOfMagnitude) : 0),
    ])
  };
}

type CategorizeIntoBucketsInput = GenerateRatioBucketsOutput;

interface CategorizeIntoBucketsOutput {
  dataPoints: Array<EligibleSarsCov2EstimateForVisualization & { exactRatio: number, bucket: string }>
  ratioBuckets: string[];
}

const categorizeIntoBuckets = (input: CategorizeIntoBucketsInput): CategorizeIntoBucketsOutput => {
  if(input.ratioBuckets.length === 0) {
    return {
      dataPoints: [],
      ratioBuckets: input.ratioBuckets
    }
  }
  return {
    dataPoints: input.dataPoints.map((dataPoint) => ({
      ...dataPoint,
      bucket: input.ratioBuckets
        .map((ratioBucket) => ({
          differenceFromRatioBucket: Math.abs( parseFloat(ratioBucket) - dataPoint.exactRatio ),
          ratioBucket: ratioBucket
        }))
        .sort((elementA, elementB) => elementA.differenceFromRatioBucket - elementB.differenceFromRatioBucket)
        [0].ratioBucket
    })),
    ratioBuckets: input.ratioBuckets
  };
}


export const NumberOfInfectionsPerConfirmedCaseAtTheStudyMidpointByGbdSuperRegion = () => {
  const state = useContext(SarsCov2Context);

  const consideredData = useMemo(() => state.filteredData
    .filter((dataPoint: SarsCov2Estimate): dataPoint is EligibleSarsCov2EstimateForVisualization =>
      !!dataPoint.gbdSuperRegion
      && dataPoint.seroprevalence !== undefined
      && dataPoint.seroprevalence !== null
      && dataPoint.countryPositiveCasesPerMillionPeople !== undefined
      && dataPoint.countryPositiveCasesPerMillionPeople !== null 
    )
  , [ state.filteredData ]);

  const { dataPoints, ratioBuckets } = useMemo(() => pipe(
    { dataPoints: consideredData },
    generateExactRatios,
    generateRatioBuckets,
    categorizeIntoBuckets
  ), [ consideredData ])

  return (
    <LineChart
      graphId="number-of-infections-per-confirmed-case-at-the-study-midpoint-by-gbd-super-region"
      data={dataPoints}
      primaryGroupingFunction={(dataPoint) => dataPoint.bucket}
      primaryGroupingSortFunction={(ratioA, ratioB) => parseFloat(ratioA) - parseFloat(ratioB)}
      allPrimaryGroups={ratioBuckets}
      secondaryGroupingFunction={(dataPoint) => dataPoint.gbdSuperRegion}
      secondaryGroupingSortFunction={(gbdSuperRegionA, gbdSuperRegionB) => gbdSuperRegionA > gbdSuperRegionB ? 1 : -1}
      secondaryGroupingKeyToLabel={(gbdSuperRegion) => gbdSuperRegionToLabelMap[gbdSuperRegion]}
      transformOutputValue={({ data }) => data.length}
      getLineColour={(gbdSuperRegion) => barColoursForGbdSuperRegions[gbdSuperRegion] ?? generateRandomColour()}
      legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
    />
  );
};
