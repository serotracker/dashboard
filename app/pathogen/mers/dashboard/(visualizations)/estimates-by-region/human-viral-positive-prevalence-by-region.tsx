import { MouseEventHandler, useCallback, useMemo, useState } from "react";
import { HumanMersViralEstimate, MersEstimate, isHumanMersViralEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
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
import { HumanMersViralEstimatePopupContent } from "../../(map)/human-mers-viral-estimate-pop-up-content";
import { useBarColourAndLegendProps } from "@/components/customs/visualizations/use-bar-colour-and-legend-props";

const HumanViralPositivePrevalenceByRegionTooltip = <
  TValueType extends number | string | Array<number | string>,
  TNameType extends number | string
>(props: TooltipProps<TValueType, TNameType> & {
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}) => {
  const { active, payload, label } = props;

  if (active && payload && payload.length) {
    const positivePrevalencePayload = payload.find((element) => element.name === 'positivePrevalence')?.payload;

    if(!positivePrevalencePayload) {
      return null;
    }

    return (
      <HumanMersViralEstimatePopupContent
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        className="border border-black text-sm"
        estimate={positivePrevalencePayload}
      />
    );
  }

  return null;
};

interface HumanViralPositivePrevalenceByRegionProps {
  humanMersViralEstimates: HumanMersViralEstimate[];
  regionGroupingFunction: (dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry) => WhoRegion | UnRegion | string | null | undefined;
  regionToDotColour: (region:WhoRegion | UnRegion | string, regionIndex: number) => string;
  regionToLegendLabel: (region:WhoRegion | UnRegion | string) => string;
  legendConfiguration: LegendConfiguration;
}

export const HumanViralPositivePrevalenceByRegion = (props: HumanViralPositivePrevalenceByRegionProps) => {
  const { humanMersViralEstimates, regionGroupingFunction, regionToLegendLabel, legendConfiguration, regionToDotColour: regionToDotColourDefault } = props;
  const [ isMouseOnTooltip, setIsMouseOnTooltip ] = useState<boolean>(false);

  const {
    getColourForSecondaryKey,
    legendProps
  } = useBarColourAndLegendProps({
    getColourForSecondaryKeyDefault: regionToDotColourDefault,
    secondaryGroupingKeyToLabel: regionToLegendLabel,
    legendConfiguration
  });

  const consideredData = useMemo(() =>
    humanMersViralEstimates
      .map((dataPoint) => ({
        ...dataPoint,
        region: regionGroupingFunction(dataPoint),
        positivePrevalence95CILower:
          dataPoint.primaryEstimateInfo.positivePrevalence95CILower ?? dataPoint.primaryEstimateInfo.positivePrevalenceCalculated95CILower,
        positivePrevalence95CIUpper:
          dataPoint.primaryEstimateInfo.positivePrevalence95CIUpper ?? dataPoint.primaryEstimateInfo.positivePrevalenceCalculated95CIUpper,
      }))
      .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'region'> & {region: NonNullable<typeof dataPoint['region']>} => !!dataPoint.region)
      .sort((dataPointA, dataPointB) => dataPointA.primaryEstimateInfo.positivePrevalence - dataPointB.primaryEstimateInfo.positivePrevalence)
      .map(( dataPoint, index ) => ({
        ...dataPoint,
        positivePrevalence: parseFloat(
          (dataPoint.primaryEstimateInfo.positivePrevalence * 100).toFixed(1)
        ),
        positivePrevalenceError: [
          parseFloat((
            dataPoint.primaryEstimateInfo.positivePrevalence * 100 -
            dataPoint.positivePrevalence95CILower * 100
          ).toFixed(1)),
          parseFloat((
            dataPoint.positivePrevalence95CIUpper * 100 - 
            dataPoint.primaryEstimateInfo.positivePrevalence * 100
          ).toFixed(1))
        ],
        estimateNumber: index + 1
      }))
  , [ humanMersViralEstimates, regionGroupingFunction ]);

  const consideredDataByRegion = useMemo(() =>
    typedGroupBy(consideredData, (dataPoint) => dataPoint.region)
  , [ consideredData ]);

  const allRegions = useMemo(() => typedObjectKeys(consideredDataByRegion), [ consideredDataByRegion ]);

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
          offset={0}
          content={(props) => (<HumanViralPositivePrevalenceByRegionTooltip
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
            fill={getColourForSecondaryKey(region, regionIndex)}
          >
            <ErrorBar
              dataKey="positivePrevalenceError"
              stroke={getColourForSecondaryKey(region, regionIndex)}
              width={0}
              direction="x"
            />
          </Scatter>
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  )
}