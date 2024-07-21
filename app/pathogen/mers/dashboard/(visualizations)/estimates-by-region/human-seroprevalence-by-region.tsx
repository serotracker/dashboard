import { useMemo } from "react";
import { HumanMersSeroprevalenceEstimate, MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
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

const HumanSeroprevalenceByRegionTooltip: TooltipContentType<string, string> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const seroprevalencePayload = payload.find((element) => element.name === 'seroprevalence')?.payload;

    if(!seroprevalencePayload) {
      return null;
    }

    const seroprevalence = seroprevalencePayload.seroprevalence;
    const seroprevalence95CILower = seroprevalencePayload.seroprevalence95CILower
      ? `${seroprevalencePayload.seroprevalence95CILower}%`
      : 'Unknown';
    const seroprevalence95CIUpper = seroprevalencePayload.seroprevalence95CIUpper
      ? `${seroprevalencePayload.seroprevalence95CIUpper}%`
      : 'Unknown';

    return (
      <div className="bg-white p-4">
        <p> Seroprevalence: {seroprevalence}% </p>
        <p> 95% CI: [{seroprevalence95CILower}, {seroprevalence95CIUpper}] </p>
      </div>
    );
  }

  return null;
};

interface HumanSeroprevalenceByRegionProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  regionGroupingFunction: (dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry) => WhoRegion | UnRegion | null | undefined;
  regionToDotColour: (region:WhoRegion | UnRegion) => string;
  regionToLegendLabel: (region:WhoRegion | UnRegion) => string;
  legendConfiguration: LegendConfiguration;
}

export const HumanSeroprevalenceByRegion = (props: HumanSeroprevalenceByRegionProps) => {
  const { data, regionGroupingFunction, regionToDotColour, regionToLegendLabel } = props;

  const consideredData = useMemo(() =>
    data
      .filter((dataPoint): dataPoint is HumanMersSeroprevalenceEstimate => dataPoint.__typename === 'HumanMersEstimate')
      .map((dataPoint) => ({ ...dataPoint, region: regionGroupingFunction(dataPoint) }))
      .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'region'> & {region: NonNullable<typeof dataPoint['region']>} => !!dataPoint.region)
      .sort((dataPointA, dataPointB) => dataPointA.seroprevalence - dataPointB.seroprevalence)
      .map(( dataPoint, index ) => ({
        ...dataPoint,
        seroprevalence: parseFloat(
          (dataPoint.seroprevalence * 100).toFixed(1)
        ),
        seroprevalenceError: [
          dataPoint.seroprevalence95CILower ? parseFloat(
            (
              dataPoint.seroprevalence * 100 -
              dataPoint.seroprevalence95CILower * 100
            ).toFixed(1)
          ) : 0,
          dataPoint.seroprevalence95CIUpper ? parseFloat(
            (
              dataPoint.seroprevalence95CIUpper * 100 -
              dataPoint.seroprevalence * 100
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
      key={`human-seroprevalence-by-region`}
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
          <tspan fontSize="20">Human Seroprevalence</tspan>
        </text>
        <CartesianGrid />
        <XAxis
          dataKey="seroprevalence"
          type="number"
          domain={[0, 100]}
          unit="%"
        >
          <Label
            value="Seroprevalence"
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
          content={HumanSeroprevalenceByRegionTooltip}
        />
        <Legend {...legendProps}/>
        {allRegions.map((region) => (
          <Scatter
            key={region}
            data={consideredDataByRegion[region]}
            name={regionToLegendLabel(region)}
            fill={regionToDotColour(region)}
          >
            <ErrorBar
              dataKey="seroprevalenceError"
              stroke={regionToDotColour(region)}
              width={0}
              direction="x"
            />
          </Scatter>
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  )
}