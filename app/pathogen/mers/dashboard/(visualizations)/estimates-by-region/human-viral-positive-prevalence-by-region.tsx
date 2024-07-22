import { useMemo } from "react";
import { HumanMersViralEstimate, MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { UnRegion, WhoRegion } from "@/gql/graphql";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import {
  CartesianGrid,
  ErrorBar,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Label,
  Legend
} from "recharts";
import { typedGroupBy, typedObjectKeys } from "@/lib/utils";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { ContentType as TooltipContentType } from "recharts/types/component/Tooltip";

const HumanViralPositivePrevalenceByRegionTooltip: TooltipContentType<string, string> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const positivePrevalencePayload = payload.find((element) => element.name === 'positivePrevalence')?.payload;

    if(!positivePrevalencePayload) {
      return null;
    }

    const positivePrevalence = positivePrevalencePayload.positivePrevalence;
    const positivePrevalence95CILower = positivePrevalencePayload.positivePrevalence95CILower
      ? `${positivePrevalencePayload.positivePrevalence95CILower}%`
      : 'Unknown';
    const positivePrevalence95CIUpper = positivePrevalencePayload.positivePrevalence95CIUpper
      ? `${positivePrevalencePayload.positivePrevalence95CIUpper}%`
      : 'Unknown';

    return (
      <div className="bg-white p-4">
        <p> Viral Positive Prevalence: {positivePrevalence}% </p>
        <p> 95% CI: [{positivePrevalence95CILower}, {positivePrevalence95CIUpper}] </p>
      </div>
    );
  }

  return null;
};

interface HumanViralPositivePrevalenceByRegionProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  regionGroupingFunction: (dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry) => WhoRegion | UnRegion | string | null | undefined;
  regionToDotColour: (region:WhoRegion | UnRegion | string, regionIndex: number) => string;
  regionToLegendLabel: (region:WhoRegion | UnRegion | string) => string;
  legendConfiguration: LegendConfiguration;
}

export const HumanViralPositivePrevalenceByRegion = (props: HumanViralPositivePrevalenceByRegionProps) => {
  const { data, regionGroupingFunction, regionToDotColour, regionToLegendLabel } = props;

  const consideredData = useMemo(() =>
    data
      .filter((dataPoint): dataPoint is HumanMersViralEstimate  => dataPoint.__typename === 'HumanMersViralEstimate')
      .map((dataPoint) => ({ ...dataPoint, region: regionGroupingFunction(dataPoint) }))
      .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'region'> & {region: NonNullable<typeof dataPoint['region']>} => !!dataPoint.region)
      .sort((dataPointA, dataPointB) => dataPointA.positivePrevalence - dataPointB.positivePrevalence)
      .map(( dataPoint, index ) => ({
        ...dataPoint,
        positivePrevalence: parseFloat(
          (dataPoint.positivePrevalence * 100).toFixed(1)
        ),
        positivePrevalenceError: [
          dataPoint.positivePrevalence95CILower ? parseFloat(
            (
              dataPoint.positivePrevalence * 100 -
              dataPoint.positivePrevalence95CILower * 100
            ).toFixed(1)
          ) : 0,
          dataPoint.positivePrevalence95CIUpper ? parseFloat(
            (
              dataPoint.positivePrevalence95CIUpper * 100 -
              dataPoint.positivePrevalence * 100
            ).toFixed(1)
          ) : 0,
        ],
        estimateNumber: index + 1
      }))
  , [ data, regionGroupingFunction ]);

  const consideredDataByRegion = useMemo(() =>
    typedGroupBy(consideredData, (dataPoint) => dataPoint.region)
  , [ consideredData ]);

  const allRegions = useMemo(() => typedObjectKeys(consideredDataByRegion), [ consideredDataByRegion ]);

  const legendProps =
    props.legendConfiguration === LegendConfiguration.RIGHT_ALIGNED
      ? {
          layout: "vertical" as const,
          verticalAlign: "middle" as const,
          align: "right" as const,
          wrapperStyle: { right: -10 },
        }
      : {
          layout: "horizontal" as const,
          verticalAlign: "bottom" as const,
          align: "center" as const,
          wrapperStyle: {
            paddingTop: 10,
            bottom: 0,
          },
        };

  return (
    <ResponsiveContainer
      width={"100%"}
      key={`human-viral-positive-prevalence-by-region`}
      height={"100%"}
    >
      <ScatterChart
        width={730}
        height={250}
        margin={{ bottom: 40, left: 8, top: 50, right: 10 }}
      >
        <text
          x='50%'
          y={20}
          fill="black"
          textAnchor="middle"
          dominantBaseline="central"
        >
          <tspan fontSize="20">Human Viral Positive Prevalence</tspan>
        </text>
        <CartesianGrid />
        <XAxis
          dataKey="positivePrevalence"
          type="number"
          domain={[0, 100]}
          unit="%"
        >
          <Label
            value="Viral Positive Prevalence"
            offset={-8}
            position="insideBottom"
          />
        </XAxis>
        <YAxis
          dataKey="estimateNumber"
          type="number"
          domain={[0, consideredData.length + 1]}
          allowDataOverflow={true}
          tick={false}
          label={{
            value: "Study estimates",
            angle: -90,
            offset: 40,
            position: "insideLeft",
          }}
        />
        <Tooltip
          content={HumanViralPositivePrevalenceByRegionTooltip}
        />
        <Legend {...legendProps}/>
        {allRegions.map((region, regionIndex) => (
          <Scatter
            key={region}
            data={consideredDataByRegion[region]}
            name={regionToLegendLabel(region)}
            fill={regionToDotColour(region, regionIndex)}
          >
            <ErrorBar
              dataKey="positivePrevalenceError"
              stroke={regionToDotColour(region, regionIndex)}
              width={0}
              direction="x"
            />
          </Scatter>
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  )
}