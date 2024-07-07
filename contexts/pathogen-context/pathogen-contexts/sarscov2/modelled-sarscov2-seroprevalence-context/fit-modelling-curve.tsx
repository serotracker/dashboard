import uniq from 'lodash/uniq';
import {
  GenerateBestFitCurveInput,
  GenerateBestFitCurveOutput,
} from "@/components/customs/visualizations/line-fitting/use-best-fit-curve";
import { generateRange } from '@/lib/utils';

interface FitModellingCurveInput<TGroupingKeyValue extends string> {
  dataPoints: Array<{
    groupingKey: TGroupingKeyValue
    data: Array<{
      xAxisValue: number;
      yAxisValue: number;
    }>
  }>;
  generateBestFitCurve: (input: GenerateBestFitCurveInput) => GenerateBestFitCurveOutput
}

interface FitModellingCurveOutput<TGroupingKeyValue extends string> {
  dataPoints: Array<{
    groupingKey: TGroupingKeyValue
    data: Array<{
      xAxisValue: number;
      rawYAxisValue: number | undefined;
      modelledYAxisValue: number;
    }>
  }>
}

export const fitModellingCurve = <TGroupingKeyValue extends string>(
  input: FitModellingCurveInput<TGroupingKeyValue>
): FitModellingCurveOutput<TGroupingKeyValue>  => {
  const dataPoints = input.dataPoints.map((dataPoint) => {
    const { data, groupingKey } = dataPoint;
    const { xAxisValueToYAxisValue } = input.generateBestFitCurve({
      data,
      maximumPolynomialOrder: 2
    });

    const allXAxisValuesForPrimaryKey = uniq(data.map(({ xAxisValue }) => xAxisValue));
    const smallestXAxisValueForPrimaryKey = Math.min(...allXAxisValuesForPrimaryKey);
    const largestXAxisValueForPrimaryKey = Math.max(...allXAxisValuesForPrimaryKey);

    const returnData = generateRange({
      startInclusive: smallestXAxisValueForPrimaryKey,
      endInclusive: largestXAxisValueForPrimaryKey,
      stepSize: 1
    })
      .map((xAxisValue) => {
        const modelledYAxisValue = xAxisValueToYAxisValue({ xAxisValue });
        const rawYAxisValue = data.find((element) => element.xAxisValue === xAxisValue)?.yAxisValue

        return {
          xAxisValue: xAxisValue,
          modelledYAxisValue: modelledYAxisValue * 100,
          rawYAxisValue: rawYAxisValue ? (rawYAxisValue * 100) : undefined
        }
      })
      .filter((element) =>
        element.modelledYAxisValue <= 100 &&
        element.modelledYAxisValue >= 0
      )
      .filter((element, index, array) => {
        if(index === 0 && array.length === 1) {
          return true;
        }
        if(index === 0 && array.length > 1) {
          const secondElement = array[1];

          return element.modelledYAxisValue <= secondElement.modelledYAxisValue;
        }

        const previousElement = array[index - 1]

        return element.modelledYAxisValue >= previousElement.modelledYAxisValue;
      })
    
    return {
      data: returnData,
      groupingKey
    }
  });
  return { dataPoints }
}