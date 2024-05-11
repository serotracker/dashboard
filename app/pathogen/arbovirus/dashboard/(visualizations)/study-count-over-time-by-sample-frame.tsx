import { useContext } from "react";
import parseISO from 'date-fns/parseISO';
import { ArboContext, ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import { AreaChart } from "@/components/customs/visualizations/area-chart";
import { generateRandomColour } from "@/lib/utils";

interface GenerateTimeBucketForEstimateInput {
  estimate: ArbovirusEstimate;
}

const generateTimeBucketForEstimate = (input: GenerateTimeBucketForEstimateInput): string => {
  return parseISO(input.estimate.sampleEndDate).getFullYear().toString();
}

const barColoursForSampleFrames: { [key: string]: string } = {
  "Community": "#FF5733",
  "Positive cases of a different arbovirus": "#C70039",
  "Pregnant or parturient women": "#900C3F",
  "Perinatal": "#581845",
  "Inpatients": "#1C2833",
  "Target group": "#B2BABB",
  "Students and Daycares": "#2E4053",
  "Essential non-healthcare workers": "#D5D8DC",
  "Positive or suspected cases": "#85C1E9",
  "Outpatients": "#AED6F1",
  "Blood donors": "#A569BD",
  "Other": "#F4D03F"
};

export const StudyCountOverTimeBySampleFrame = () => {
  const state = useContext(ArboContext);

  return (
    <AreaChart
      graphId="arbovirus-study-count-over-time-by-sample-frame"
      data={state.filteredData.filter((dataPoint: ArbovirusEstimate): dataPoint is Omit<ArbovirusEstimate, "sampleEndDate" | "sampleFrame">
        & {
          sampleEndDate: NonNullable<ArbovirusEstimate["sampleEndDate"]>;
          sampleFrame: NonNullable<ArbovirusEstimate["sampleFrame"]>;
        } => !!dataPoint.sampleEndDate && !!dataPoint.sampleFrame
      )}
      primaryGroupingFunction={(dataPoint) => generateTimeBucketForEstimate({ estimate: dataPoint })}
      secondaryGroupingFunction={(dataPoint) => dataPoint.sampleFrame}
      transformOutputValue={(data) => data.length}
      getBarColour={(sampleFrame) => barColoursForSampleFrames[sampleFrame] ?? generateRandomColour()}
    />
  );
}