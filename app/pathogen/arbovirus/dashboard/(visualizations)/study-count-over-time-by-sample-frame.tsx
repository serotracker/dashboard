import { useMemo } from "react";
import { parseISO, isAfter } from "date-fns";
import { ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { AreaChart } from "@/components/customs/visualizations/area-chart";
import { generateRandomColour, generateRange, typedGroupBy, typedObjectEntries, typedObjectFromEntries } from "@/lib/utils";
import { useGroupedArbovirusEstimateData } from "../../use-arbo-primary-estimate-data";

interface GenerateTimeBucketForEstimateInput {
  estimate: Omit<ArbovirusEstimate, 'sampleEndDate'> & { sampleEndDate: Date };
  latestSamplingEndDate: Date;
}

const generateTimeBucketsForEstimate = (input: GenerateTimeBucketForEstimateInput): string[] => {
  const latestSamplingEndDateYear = input.latestSamplingEndDate.getFullYear();
  const yearOfEstimate = input.estimate.sampleEndDate.getFullYear();

  if(yearOfEstimate >= latestSamplingEndDateYear) {
    return [ yearOfEstimate.toString() ];
  }
  return generateRange({
    startInclusive: yearOfEstimate,
    endInclusive: latestSamplingEndDateYear,
    stepSize: 1
  }).map((year) => year.toString());
}

interface GetLatestSamplingEndDateFromDataInput {
  data: Array<Omit<ArbovirusEstimate, 'sampleEndDate'> & { sampleEndDate: Date }>;
}

const getLatestSamplingEndDateFromData = (input: GetLatestSamplingEndDateFromDataInput): Date => {
  if(input.data.length === 0) {
    return new Date();
  }

  let latestSamplingEndDate = input.data[0].sampleEndDate;

  input.data.forEach(({ sampleEndDate }) => {
    latestSamplingEndDate = isAfter(sampleEndDate, latestSamplingEndDate) ? sampleEndDate : latestSamplingEndDate;
  })
  
  return latestSamplingEndDate;
}

interface GetEightMostCommonSampleFramesFromDataInput {
  data: Array<{ sampleFrame: NonNullable<ArbovirusEstimate["sampleFrame"]> }>;
}

const getEightMostCommonSampleFramesFromData = (input: GetEightMostCommonSampleFramesFromDataInput): string[] => {
  return typedObjectEntries(
    typedGroupBy(
      input.data,
      ({sampleFrame}) => sampleFrame
    )
  ).map(([sampleFrame, data]) => ({sampleFrame, estimateCount: data.length}))
    .sort((a, b) => b.estimateCount - a.estimateCount)
    .slice(0, 8)
    .map(({ sampleFrame }) => sampleFrame);
}

const barColoursForSampleFrames: { [key: string]: string } = {
  "Community": "#FF5733",
  "Positive cases of a different arbovirus": "#C70039",
  "Pregnant or parturient women": "#900C3F",
  "Perinatal": "#581845",
  "Non-arboviral patients": "#4ADE80",
  "Positive (PCR) or suspected cases": "#22D3EE",
  "Inpatients": "#1C2833",
  "Target group": "#B2BABB",
  "Students and Daycares": "#2E4053",
  "Essential non-healthcare workers": "#D5D8DC",
  "Positive or suspected cases": "#85C1E9",
  "Outpatients": "#AED6F1",
  "Blood donors": "#A569BD",
  "Other": "#F4D03F"
};

const sampleFrameToSortOrderMap: Record<string, number | undefined> = {
  "Community": 1,
  "Positive cases of a different arbovirus": 2,
  "Pregnant or parturient women": 3,
  "Perinatal": 4,
  "Non-arboviral patients": 5,
  "Positive (PCR) or suspected cases": 6,
  "Inpatients": 7,
  "Target group": 8,
  "Students and Daycares": 9,
  "Essential non-healthcare workers": 10,
  "Positive or suspected cases": 11,
  "Outpatients": 12,
  "Blood donors": 13,
  "Other": 14
}

export const StudyCountOverTimeBySampleFrame = () => {
  const { primaryEstimateData: state } = useGroupedArbovirusEstimateData();

  const consideredData = useMemo(() => state.filteredData
    .filter((dataPoint: ArbovirusEstimate): dataPoint is Omit<ArbovirusEstimate, "sampleEndDate" | "sampleFrame">
      & {
        sampleEndDate: NonNullable<ArbovirusEstimate["sampleEndDate"]>;
        sampleFrame: NonNullable<ArbovirusEstimate["sampleFrame"]>;
      } => !!dataPoint.sampleEndDate && !!dataPoint.sampleFrame
    ).map((dataPoint) => ({...dataPoint, sampleEndDate: parseISO(dataPoint.sampleEndDate)})),
    [state.filteredData]
  );

  const latestSamplingEndDate = useMemo(() => getLatestSamplingEndDateFromData({data: consideredData}), [consideredData])
  const eightMostCommonSampleFrames = useMemo(() => getEightMostCommonSampleFramesFromData({data: consideredData}), [consideredData])

  return (
    <AreaChart
      graphId="arbovirus-study-count-over-time-by-sample-frame"
      data={consideredData}
      primaryGroupingFunction={(dataPoint) => generateTimeBucketsForEstimate({ estimate: dataPoint, latestSamplingEndDate })}
      secondaryGroupingFunction={(dataPoint) => eightMostCommonSampleFrames.includes(dataPoint.sampleFrame) ?  dataPoint.sampleFrame : 'Other'}
      transformOutputValue={({ data }) => data.length}
      secondaryGroupingSortFunction={(sampleFrameA, sampleFrameB) => (sampleFrameToSortOrderMap[sampleFrameA] ?? 99) - (sampleFrameToSortOrderMap[sampleFrameB] ?? 99)}
      getBarColour={(sampleFrame) => barColoursForSampleFrames[sampleFrame] ?? generateRandomColour()}
    />
  );
}