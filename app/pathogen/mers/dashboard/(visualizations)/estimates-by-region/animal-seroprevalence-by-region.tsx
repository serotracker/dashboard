import { useMemo } from "react";
import { AnimalMersSeroprevalenceEstimate, MersEstimate, isAnimalMersSeroprevalenceEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
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

const AnimalSeroprevalenceByRegionTooltip: TooltipContentType<string, string> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const seroprevalencePayload = payload.find((element) => element.name === 'seroprevalence')?.payload;

    if(!seroprevalencePayload) {
      return null;
    }

    const seroprevalence = seroprevalencePayload.seroprevalence;
    const seroprevalence95CILower = typeof seroprevalencePayload.seroprevalence95CILower === 'number' 
      ? `${seroprevalencePayload.seroprevalence95CILower}%`
      : 'Unknown';
    const seroprevalence95CIUpper = typeof seroprevalencePayload.seroprevalence95CIUpper === 'number' 
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

interface AnimalSeroprevalenceByRegionProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  regionGroupingFunction: (dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry) => WhoRegion | UnRegion | string | null | undefined;
  regionToDotColour: (region:WhoRegion | UnRegion | string, regionIndex: number) => string;
  regionToLegendLabel: (region:WhoRegion | UnRegion | string) => string;
  legendConfiguration: LegendConfiguration;
}

export const AnimalSeroprevalenceByRegion = (props: AnimalSeroprevalenceByRegionProps) => {
  const { data, regionGroupingFunction, regionToDotColour, regionToLegendLabel } = props;

  const consideredData = useMemo(() =>
    data
      .filter((dataPoint): dataPoint is AnimalMersSeroprevalenceEstimate => 'primaryEstimateInfo' in dataPoint && isAnimalMersSeroprevalenceEstimate(dataPoint))
      .map((dataPoint) => ({ ...dataPoint, region: regionGroupingFunction(dataPoint) }))
      .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'region'> & {region: NonNullable<typeof dataPoint['region']>} => !!dataPoint.region)
      .sort((dataPointA, dataPointB) => dataPointA.primaryEstimateInfo.seroprevalence - dataPointB.primaryEstimateInfo.seroprevalence)
      .map(( dataPoint, index ) => ({
        ...dataPoint,
        seroprevalence: parseFloat(
          (dataPoint.primaryEstimateInfo.seroprevalence * 100).toFixed(1)
        ),
        seroprevalence95CILower: dataPoint.primaryEstimateInfo.seroprevalence95CILower
          ? parseFloat((dataPoint.primaryEstimateInfo.seroprevalence95CILower * 100).toFixed(1))
          : 'Unknown',
        seroprevalence95CIUpper: dataPoint.primaryEstimateInfo.seroprevalence95CIUpper
          ? parseFloat((dataPoint.primaryEstimateInfo.seroprevalence95CIUpper * 100).toFixed(1))
          : 'Unknown',
        seroprevalenceError: [
          dataPoint.primaryEstimateInfo.seroprevalence95CILower ? parseFloat(
            (
              dataPoint.primaryEstimateInfo.seroprevalence * 100 -
              dataPoint.primaryEstimateInfo.seroprevalence95CILower * 100
            ).toFixed(1)
          ) : 0,
          dataPoint.primaryEstimateInfo.seroprevalence95CIUpper ? parseFloat(
            (
              dataPoint.primaryEstimateInfo.seroprevalence95CIUpper * 100 -
              dataPoint.primaryEstimateInfo.seroprevalence * 100
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
      key={`animal-seroprevalence-by-region`}
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
          <tspan fontSize="20">Animal Seroprevalence</tspan>
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
          content={AnimalSeroprevalenceByRegionTooltip}
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
              dataKey="seroprevalenceError"
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