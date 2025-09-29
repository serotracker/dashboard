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
import { useBarColourAndLegendProps } from "@/components/customs/visualizations/use-bar-colour-and-legend-props";
import { generateConciseSourceId } from "../../(table)/mers-seroprevalence-and-viral-estimates-shared-column-configuration";
import { EstimatesByRegionYAxisTick } from "../estimates-by-region";

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
  regionSortingFunction: (regionA: WhoRegion | UnRegion | string, regionB: WhoRegion | UnRegion | string) => number;
}

export const AnimalViralPositivePrevalenceByRegion = (props: AnimalViralPositivePrevalenceByRegionProps) => {
  const { animalMersViralEstimates, regionGroupingFunction, regionToLegendLabel, legendConfiguration, regionToDotColour: regionToDotColourDefault, regionSortingFunction } = props;
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
    animalMersViralEstimates
      .map((dataPoint) => ({
        ...dataPoint,
        region: regionGroupingFunction(dataPoint),
        positivePrevalence95CILower:
          dataPoint.primaryEstimateInfo.positivePrevalence95CILower ?? dataPoint.primaryEstimateInfo.positivePrevalenceCalculated95CILower,
        positivePrevalence95CIUpper:
          dataPoint.primaryEstimateInfo.positivePrevalence95CIUpper ?? dataPoint.primaryEstimateInfo.positivePrevalenceCalculated95CIUpper,
      }))
      .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'region'> & {region: NonNullable<typeof dataPoint['region']>} => !!dataPoint.region)
      .sort((dataPointA, dataPointB) => {
        if(dataPointA.region !== dataPointB.region) {
          return regionSortingFunction(dataPointA.region, dataPointB.region);
        }

        return dataPointA.primaryEstimateInfo.positivePrevalence - dataPointB.primaryEstimateInfo.positivePrevalence;
      })
      .map(( dataPoint, index ) => ({
        ...dataPoint,
        positivePrevalence: parseFloat(
          (dataPoint.primaryEstimateInfo.positivePrevalence * 100).toFixed(3)
        ),
        positivePrevalenceError: [
          parseFloat((
            dataPoint.primaryEstimateInfo.positivePrevalence * 100 -
            dataPoint.positivePrevalence95CILower * 100
          ).toFixed(3)),
          parseFloat((
            dataPoint.positivePrevalence95CIUpper * 100 - 
            dataPoint.primaryEstimateInfo.positivePrevalence * 100
          ).toFixed(3))
        ],
        estimateNumber: index + 1
      }))
  , [ animalMersViralEstimates, regionGroupingFunction, regionSortingFunction ]);

  const estimateNumberToEstimateNameMap = useMemo(() => {
    return typedGroupBy(
      consideredData.map((estimate) => ({
        estimateNumber: estimate.estimateNumber.toString(),
        estimateName: generateConciseSourceId(estimate)
      })),
      (dataPoint) => dataPoint.estimateNumber
    )
  }, [ consideredData ]);

  const consideredDataByRegion = useMemo(() =>
    typedGroupBy(consideredData, (dataPoint) => dataPoint.region)
  , [ consideredData ]);

  const allRegions = useMemo(() => typedObjectKeys(consideredDataByRegion), [ consideredDataByRegion ]);

  if(consideredData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <p> No data. </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width={"100%"}
      key={`animal-viral-positive-prevalence-by-region`}
      height={"90%"}
    >
      <ScatterChart
        width={730}
        height={250}
        margin={{ bottom: 40, left: 200, top: 50, right: 10 }}
      >
        <text
          x='50%'
          y={20}
          fill="black"
          textAnchor="middle"
          dominantBaseline="central"
        >
          <tspan fontSize="20">Animal Viral Prevalence</tspan>
        </text>
        <CartesianGrid strokeDasharray={"4 8"}/>
        <XAxis
          dataKey="positivePrevalence"
          type="number"
          domain={[-25, 100]}
          ticks={[0, 25, 50, 75, 100]}
          unit="%"
        >
          <Label
            value="Viral Prevalence"
            offset={-8}
            position="insideBottom"
          />
        </XAxis>
        <YAxis
          dataKey="estimateNumber"
          type="number"
          domain={[0, consideredData.length + 1]}
          allowDataOverflow={true}
          ticks={Array(consideredData.length).fill(0).map((_, index) => index + 1)}
          tick={(tickProps) => EstimatesByRegionYAxisTick({ tickProps, estimateNumberToEstimateNameMap })}
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