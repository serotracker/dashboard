import { MouseEventHandler, useMemo, useState } from "react";
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
import { TooltipProps } from "recharts/types/component/Tooltip";
import { AnimalMersSeroprevalenceEstimatePopupContent } from "../../(map)/animal-mers-seroprevalence-estimate-pop-up-content";
import { useEstimatesByRegionLegendProps } from "./use-estimates-by-region-legend-props";

const AnimalSeroprevalenceByRegionTooltip = <
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
      <AnimalMersSeroprevalenceEstimatePopupContent
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        className="border border-black text-sm"
        estimate={seroprevalencePayload}
      />
    );
  }

  return null;
};

interface AnimalSeroprevalenceByRegionProps {
  animalMersSeroprevalenceEstimates: AnimalMersSeroprevalenceEstimate[];
  regionGroupingFunction: (dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry) => WhoRegion | UnRegion | string | null | undefined;
  regionToDotColour: (region:WhoRegion | UnRegion | string, regionIndex: number) => string;
  regionToLegendLabel: (region:WhoRegion | UnRegion | string) => string;
  legendConfiguration: LegendConfiguration;
}

export const AnimalSeroprevalenceByRegion = (props: AnimalSeroprevalenceByRegionProps) => {
  const { animalMersSeroprevalenceEstimates, regionGroupingFunction, regionToLegendLabel, legendConfiguration, regionToDotColour: regionToDotColourDefault } = props;
  const [ isMouseOnTooltip, setIsMouseOnTooltip ] = useState<boolean>(false);

  const {
    regionToDotColour,
    legendProps
  } = useEstimatesByRegionLegendProps({
    regionToDotColourDefault,
    regionToLegendLabel,
    legendConfiguration
  });

  const consideredData = useMemo(() =>
    animalMersSeroprevalenceEstimates
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
  , [ animalMersSeroprevalenceEstimates, regionGroupingFunction ]);

  const consideredDataByRegion = useMemo(() =>
    typedGroupBy(consideredData, (dataPoint) => dataPoint.region)
  , [ consideredData ]);

  const allRegions = useMemo(() => typedObjectKeys(consideredDataByRegion), [ consideredDataByRegion ]);

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
          offset={0}
          content={(props) => (<AnimalSeroprevalenceByRegionTooltip
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