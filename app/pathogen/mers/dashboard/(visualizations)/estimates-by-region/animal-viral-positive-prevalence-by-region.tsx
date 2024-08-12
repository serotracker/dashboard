import { MouseEventHandler, useMemo, useState } from "react";
import { AnimalMersViralEstimate, MersEstimate, isAnimalMersViralEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
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
import { AnimalMersViralEstimatePopupContent } from "../../(map)/animal-mers-viral-estimate-pop-up-content";

const AnimalViralPositivePrevalenceByRegionTooltip = <
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
      <AnimalMersViralEstimatePopupContent
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        className="border border-black text-sm"
        estimate={positivePrevalencePayload}
      />
    );
  }
}

interface AnimalViralPositivePrevalenceByRegionProps {
  animalMersViralEstimates: AnimalMersViralEstimate[];
  regionGroupingFunction: (dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry) => WhoRegion | UnRegion | string | null | undefined;
  regionToDotColour: (region:WhoRegion | UnRegion | string, regionIndex: number) => string;
  regionToLegendLabel: (region:WhoRegion | UnRegion | string) => string;
  legendConfiguration: LegendConfiguration;
}

export const AnimalViralPositivePrevalenceByRegion = (props: AnimalViralPositivePrevalenceByRegionProps) => {
  const { animalMersViralEstimates, regionGroupingFunction, regionToDotColour, regionToLegendLabel } = props;
  const [ isMouseOnTooltip, setIsMouseOnTooltip ] = useState<boolean>(false);

  const consideredData = useMemo(() =>
    animalMersViralEstimates
      .map((dataPoint) => ({ ...dataPoint, region: regionGroupingFunction(dataPoint) }))
      .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'region'> & {region: NonNullable<typeof dataPoint['region']>} => !!dataPoint.region)
      .sort((dataPointA, dataPointB) => dataPointA.primaryEstimateInfo.positivePrevalence - dataPointB.primaryEstimateInfo.positivePrevalence)
      .map(( dataPoint, index ) => ({
        ...dataPoint,
        positivePrevalence: parseFloat(
          (dataPoint.primaryEstimateInfo.positivePrevalence * 100).toFixed(1)
        ),
        positivePrevalenceError: [
          dataPoint.primaryEstimateInfo.positivePrevalence95CILower ? parseFloat(
            (
              dataPoint.primaryEstimateInfo.positivePrevalence * 100 -
              dataPoint.primaryEstimateInfo.positivePrevalence95CILower * 100
            ).toFixed(1)
          ) : 0,
          dataPoint.primaryEstimateInfo.positivePrevalence95CIUpper ? parseFloat(
            (
              dataPoint.primaryEstimateInfo.positivePrevalence95CIUpper * 100 -
              dataPoint.primaryEstimateInfo.positivePrevalence * 100
            ).toFixed(1)
          ) : 0,
        ],
        estimateNumber: index + 1
      }))
  , [ animalMersViralEstimates, regionGroupingFunction ]);

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
      key={`animal-viral-positive-prevalence-by-region`}
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
          <tspan fontSize="20">Animal Viral Positive Prevalence</tspan>
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
          content={(props) => (<AnimalViralPositivePrevalenceByRegionTooltip
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