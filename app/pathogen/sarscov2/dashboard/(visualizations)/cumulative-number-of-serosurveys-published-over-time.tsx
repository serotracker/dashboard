import uniq from "lodash/uniq";
import { useMemo } from 'react';
import { AreaChart } from "@/components/customs/visualizations/area-chart";
import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { generateRandomColour, generateRange, typedGroupBy, typedObjectEntries, typedObjectFromEntries } from "@/lib/utils";
import { useContext } from "react";
import parseISO from 'date-fns/parseISO';
import isAfter from 'date-fns/isAfter';

const monthNumberToMonth: Record<number, string | undefined> = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
}
const monthToMonthNumber: Record<string, number | undefined> = {
  'Jan': 0,
  'Feb': 1,
  'Mar': 2,
  'Apr': 3,
  'May': 4,
  'Jun': 5,
  'Jul': 6,
  'Aug': 7,
  'Sep': 8,
  'Oct': 9,
  'Nov': 10,
  'Dec': 11,
}

const monthCountToString = (monthCount: number): string => {
  const year = Math.floor(monthCount / 12);
  const monthNumber = monthCount % 12;
  const month = monthNumberToMonth[monthNumber] ?? 'UNKNOWN';

  return `${month} ${year}`;
}

interface GenerateTimeBucketForEstimateInput {
  estimate: Omit<SarsCov2Estimate, 'publicationDate'> & {publicationDate: Date};
  latestPublicationDate: Date;
}

const generateTimeBucketsForEstimate = (input: GenerateTimeBucketForEstimateInput): string[] => {
  const latestPublicationDateMonthCount = (input.latestPublicationDate.getFullYear() * 12) + input.latestPublicationDate.getMonth();
  const estimateMonthCount = (input.estimate.publicationDate.getFullYear() * 12) + input.estimate.publicationDate.getMonth();

  if(estimateMonthCount >= latestPublicationDateMonthCount) {
    return [ monthCountToString(estimateMonthCount) ];
  }
  return generateRange({
    startInclusive: estimateMonthCount,
    endInclusive: latestPublicationDateMonthCount,
    stepSize: 1
  }).map((monthCount) => monthCountToString(monthCount));
}

interface GetLatestPublicationDateFromDataInput {
  data: Array<Omit<SarsCov2Estimate, 'publicationDate'> & { publicationDate: Date }>;
}

const getLatestPublicationDateFromData = (input: GetLatestPublicationDateFromDataInput): Date => {
  if(input.data.length === 0) {
    return new Date();
  }

  let latestPublicationDate = input.data[0].publicationDate;

  input.data.forEach(({ publicationDate }) => {
    latestPublicationDate = isAfter(publicationDate, latestPublicationDate) ? publicationDate : latestPublicationDate;
  })
  
  return latestPublicationDate;
}

const timeBucketSortingFunction = (timeBucketA: string, timeBucketB: string) => {
  const timeBucketAMonth = monthToMonthNumber[timeBucketA.slice(0,3)] ?? 0
  const timeBucketBMonth = monthToMonthNumber[timeBucketB.slice(0,3)] ?? 0
  const timeBucketAYear = parseInt(timeBucketA.slice(4,8))
  const timeBucketBYear = parseInt(timeBucketB.slice(4,8))

  return ((timeBucketAYear * 12) + timeBucketAMonth) - ((timeBucketBYear * 12) + timeBucketBMonth)
}

interface GetTwelveMostCommonPopulationGroupsFromDataInput {
  data: Array<{populationGroup: NonNullable<SarsCov2Estimate["populationGroup"]>}>;
}

const getTwelveMostCommonPopulationGroupsFromData = (input: GetTwelveMostCommonPopulationGroupsFromDataInput): string[] => {
  return typedObjectEntries(
    typedGroupBy(
      input.data,
      ({populationGroup}) => populationGroup
    )
  ).map(([populationGroup, data]) => ({populationGroup, studyCount: data.length}))
    .sort((a, b) => b.studyCount - a.studyCount)
    .slice(0, 12)
    .map(({ populationGroup }) => populationGroup);
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

const populationGroupToSortOrderMap: Record<string, number> = {
  "Assisted living and long-term care facilities": 1,
  "Blood donors": 2,
  "Contacts of COVID patients": 3,
  "Essential non-healthcare workers": 4,
  "Family of essential workers": 5,
  "Health care workers and caregivers": 6,
  "Hospital visitors": 7,
  "Household and community samples": 8,
  "Multiple general populations": 9,
  "Multiple populations": 10,
  "Non-essential workers and unemployed persons": 11,
  "Patients seeking care for non-COVID-19 reasons": 12,
  "Perinatal": 13,
  "Persons experiencing homelessness": 14,
  "Persons living in slums": 15,
  "Persons who are incarcerated": 16,
  "Pregnant or parturient women": 17,
  "Representative patient population": 18,
  "Residual sera": 19,
  "Students and Daycares": 20
};

export const CumulativeNumberOfSerosurveysPublishedOverTime = () => {
  const state = useContext(SarsCov2Context);

  const consideredData = useMemo(() => state.filteredData
    .filter((dataPoint: SarsCov2Estimate): dataPoint is Omit<SarsCov2Estimate, "populationGroup">
      & {
        populationGroup: NonNullable<SarsCov2Estimate["populationGroup"]>;
        publicationDate: NonNullable<SarsCov2Estimate["publicationDate"]>;
      } => !!dataPoint.populationGroup && !!dataPoint.publicationDate
    ).map((dataPoint) => ({...dataPoint, publicationDate: parseISO(dataPoint.publicationDate)})),
    [state.filteredData]
  );

  const latestPublicationDate = useMemo(() => getLatestPublicationDateFromData({data: consideredData}), [consideredData])
  const twelveMostCommonPopulationGroups = useMemo(() => getTwelveMostCommonPopulationGroupsFromData({data: consideredData}), [consideredData])

  return (
    <AreaChart
      graphId="cumulative-number-of-sc2-serosurveys-published-over-time"
      data={consideredData}
      primaryGroupingFunction={(dataPoint) => generateTimeBucketsForEstimate({ estimate: dataPoint, latestPublicationDate })}
      primaryGroupingSortFunction={(timeBucketA, timeBucketB) => timeBucketSortingFunction(timeBucketA, timeBucketB)}
      secondaryGroupingFunction={(dataPoint) => twelveMostCommonPopulationGroups.includes(dataPoint.populationGroup) ?  dataPoint.populationGroup : 'Other'}
      secondaryGroupingSortFunction={(populationGroupA, populationGroupB) => (populationGroupToSortOrderMap[populationGroupA] ?? 99) - (populationGroupToSortOrderMap[populationGroupB] ?? 99)}
      transformOutputValue={(data) => uniq(data.map((dataPoint) => dataPoint.studyName)).length}
      getBarColour={(populationGroup) => barColoursForPopulationGroups[populationGroup] ?? generateRandomColour()}
    />
  );
};
