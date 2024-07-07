import { typedGroupBy, typedObjectEntries, typedObjectFromEntries, typedObjectKeys } from "@/lib/utils";
import { CountryModelledSeroprevalenceBreakdown } from "./country-seroprevalence-breakdown-helper";
import { pipe } from "fp-ts/lib/function";
import uniq from "lodash/uniq";
import groupBy from "lodash/groupBy";
import sum from "lodash/sum";

interface GenerateDataPointsForGroupInput<
  TGroupingKey extends string,
  TGroupingKeyValue extends string
> {
  groupingKey: TGroupingKey
  countryModelledSeroprevalenceBreakdown: Record<string, Record<TGroupingKey, TGroupingKeyValue | undefined> & {
    data: Array<{
      countryPopulation: number | undefined;
      xAxisValue: number;
      yAxisValue: number;
    }>;
  }>;
}

interface GenerateDataPointsForGroupOutput<TGroupingKeyValue extends string> {
  dataPoints: Array<{
    groupingKey: TGroupingKeyValue
    data: Array<{
      xAxisValue: number;
      yAxisValue: number;
    }>
  }>
}

export const generateDataPointsForGroup = <
  TGroupingKey extends string,
  TGroupingKeyValue extends string
>(input: GenerateDataPointsForGroupInput<TGroupingKey, TGroupingKeyValue>): GenerateDataPointsForGroupOutput<TGroupingKeyValue> => {
  const allXAxisValues = pipe(
    input.countryModelledSeroprevalenceBreakdown,
    typedObjectEntries,
    (intermediateInput) => intermediateInput.flatMap(([_countryAlphaThreeCode, { data }]) => data.map(({ xAxisValue }) => xAxisValue)),
    (intermediateInput) => uniq(intermediateInput)
  )

  const dataPoints = pipe(
    input.countryModelledSeroprevalenceBreakdown,
    typedObjectEntries,
    (intermediateInput) => intermediateInput.flatMap(([key, value]) => ({...value, countryAlphaThreeCode: key})),
    (intermediateInput) => intermediateInput.filter((element): element is typeof element & Record<TGroupingKey, NonNullable<typeof element[TGroupingKey]>> => !!element[input.groupingKey]),
    (intermediateInput) => typedGroupBy(intermediateInput, ((dataPoint): TGroupingKeyValue => dataPoint[input.groupingKey])),
    typedObjectEntries,
    (intermediateInput) => intermediateInput.map(([groupingKey, dataForGroup]) => {
      const dataForEachCountry = pipe(
        dataForGroup,
        (intermediateInput) => typedGroupBy(intermediateInput, (dataPoint) => dataPoint.countryAlphaThreeCode),
        typedObjectEntries,
        (intermediateInput) => intermediateInput
          .flatMap(([countryAlphaThreeCode, value]) => {
            if(value.length !== 1) {
              return [];
            }

            const { data: dataForCountry } = value[0];

            if(dataForCountry.length === 0) {
              return [];
            }

            const allXAxisValues = pipe(
              dataForCountry,
              (intermediateInput) => intermediateInput.map(({ xAxisValue }) => xAxisValue),
              uniq
            );
            const dataGroupedByXAxisValue:Record<number, Array<{
              countryPopulation: number | undefined;
              xAxisValue: number;
              yAxisValue: number;
            }>> = groupBy(dataForCountry, (dataPoint) => dataPoint.xAxisValue);

            return allXAxisValues
              .map((xAxisValue) => {
                const dataForXAxisValue = dataGroupedByXAxisValue[xAxisValue];

                const countryPopulation = dataForCountry.at(0)?.countryPopulation;

                if(!countryPopulation) {
                  return undefined;
                }

                return {
                  countryPopulation,
                  countryAlphaThreeCode,
                  xAxisValue,
                  yAxisValue: sum(dataForXAxisValue.map(({yAxisValue}) => yAxisValue)) / dataForXAxisValue.length
                }
              })
              .filter((element): element is NonNullable<typeof element> => !!element)
          })
      )

      //Population weighted average for each group, for each xAxisValue
      const allXAxisValues = pipe(
        dataForEachCountry,
        (intermediateInput) => intermediateInput.map(({ xAxisValue }) => xAxisValue),
        uniq
      );
      const dataGroupedByXAxisValue:Record<number, Array<{
        countryPopulation: number;
        xAxisValue: number;
        yAxisValue: number;
      }>> = groupBy(dataForEachCountry, (dataPoint) => dataPoint.xAxisValue);

      const data = allXAxisValues.map((xAxisValue) => {
        const dataForXAxisValue = dataGroupedByXAxisValue[xAxisValue];

        const totalPopulation = pipe(
          dataForXAxisValue,
          (intermediateInput) => intermediateInput.map(({ countryPopulation }) => countryPopulation),
          sum
        );

        return {
          xAxisValue,
          yAxisValue: sum(dataForXAxisValue.map(({
            yAxisValue,
            countryPopulation
          }) => yAxisValue * countryPopulation)) / totalPopulation
        }
      })

      return {
        groupingKey,
        data
      }
    })
  )

  return {
    dataPoints
  }
}