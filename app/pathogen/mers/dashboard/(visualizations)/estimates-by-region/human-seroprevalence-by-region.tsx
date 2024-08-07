import { MouseEventHandler, useMemo, useState } from "react";
import { HumanMersSeroprevalenceEstimate, MersEstimate, isHumanMersSeroprevalenceEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
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
import { TooltipProps } from "recharts/types/component/Tooltip";
import { HumanMersSeroprevalenceEstimatePopupContent } from "../../(map)/human-mers-seroprevalence-estimate-pop-up-content";

const HumanSeroprevalenceByRegionTooltip = <
  TValueType extends number | string | Array<number | string>,
  TNameType extends number | string
>(props: TooltipProps<TValueType, TNameType> & {
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}) => {
  const { active, payload, label } = props;

  if (active && payload && payload.length) {
    const seroprevalencePayload = payload.find((element) => element.name === 'seroprevalence')?.payload;

    if(!seroprevalencePayload) {
      return null;
    }

    return (
      <HumanMersSeroprevalenceEstimatePopupContent
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        className="border border-black text-sm"
        estimate={seroprevalencePayload}
      />
    );
  }

  return null;
};

interface HumanSeroprevalenceByRegionProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  regionGroupingFunction: (dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry) => WhoRegion | UnRegion | string | null | undefined;
  regionToDotColour: (region:WhoRegion | UnRegion | string, regionIndex: number) => string;
  regionToLegendLabel: (region:WhoRegion | UnRegion | string) => string;
  legendConfiguration: LegendConfiguration;
}

export const HumanSeroprevalenceByRegion = (props: HumanSeroprevalenceByRegionProps) => {
  const { data, regionGroupingFunction, regionToDotColour, regionToLegendLabel } = props;
  const [ isMouseOnTooltip, setIsMouseOnTooltip ] = useState<boolean>(false);

  const consideredData = useMemo(() =>
    data
      .filter((dataPoint): dataPoint is HumanMersSeroprevalenceEstimate => 'primaryEstimateInfo' in dataPoint && isHumanMersSeroprevalenceEstimate(dataPoint))
      .map((dataPoint) => ({ ...dataPoint, region: regionGroupingFunction(dataPoint) }))
      .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'region'> & {region: NonNullable<typeof dataPoint['region']>} => !!dataPoint.region)
      .sort((dataPointA, dataPointB) => dataPointA.primaryEstimateInfo.seroprevalence - dataPointB.primaryEstimateInfo.seroprevalence)
      .map(( dataPoint, index ) => ({
        ...dataPoint,
        seroprevalence: parseFloat(
          (dataPoint.primaryEstimateInfo.seroprevalence * 100).toFixed(1)
        ),
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
          offset={0}
          content={(props) => (<HumanSeroprevalenceByRegionTooltip
            onMouseEnter={() => setIsMouseOnTooltip(true)}
            onMouseLeave={() => setIsMouseOnTooltip(false)}
            {...props}
          />)}
          wrapperStyle={{
            pointerEvents: 'auto'
          }}
          {...(isMouseOnTooltip === true) ? { active: true } : {} }
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