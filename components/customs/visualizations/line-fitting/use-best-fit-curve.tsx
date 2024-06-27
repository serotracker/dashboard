import { useCallback } from 'react';
import { polynomial } from 'regression';

interface GenerateBestFitCurveInput {
  data: Array<{
    xAxisValue: number,
    yAxisValue: number
  }>
  maximumPolynomialOrder: number;
}

interface GenerateBestFitCurveOutput {
  xAxisValueToYAxisValue: (input: { xAxisValue: number }) => number;
}

export const useBestFitCurve = () => {
  const generateBestFitCurve = useCallback((input: GenerateBestFitCurveInput): GenerateBestFitCurveOutput => {
    const allXAxisValues = input.data.map(({xAxisValue}) => xAxisValue);
    const smallestXAxisValue = Math.min(...allXAxisValues);
    const largestXAxisValue = Math.max(...allXAxisValues);
    const regressionAcceptableIntervalMinimum = 0;
    const regressionAcceptableIntervalMaximum = 100;

    const xAxisValueToRegressionXAxisValue = (xAxisValue: number): number => {
      const zeroToOneScaledXAxisValue = (xAxisValue - smallestXAxisValue) / (largestXAxisValue - smallestXAxisValue)
      return (zeroToOneScaledXAxisValue * (regressionAcceptableIntervalMaximum - regressionAcceptableIntervalMinimum)) + regressionAcceptableIntervalMinimum;
    }

    const yAxisValueToRegressionYAxisValue = (yAxisValue: number): number => {
      return yAxisValue * 10_000;
    }

    const regressionYAxisValueToYAxisValue = (regressionYAxisValue: number): number => {
      return regressionYAxisValue / 10_000;
    }

    console.log(
      input.data.map(({ xAxisValue, yAxisValue }) => [
        xAxisValueToRegressionXAxisValue(xAxisValue),
        yAxisValueToRegressionYAxisValue(yAxisValue)
      ]),
    )


    const bestFitEquationCoefficients = polynomial(
      input.data.map(({ xAxisValue, yAxisValue }) => [
        xAxisValueToRegressionXAxisValue(xAxisValue),
        yAxisValueToRegressionYAxisValue(yAxisValue)
      ]),
      { order: input.maximumPolynomialOrder }
    )
    return {
      xAxisValueToYAxisValue: (input: { xAxisValue: number }) => {
        return (regressionYAxisValueToYAxisValue(
          bestFitEquationCoefficients.predict(
            xAxisValueToRegressionXAxisValue(input.xAxisValue)
          )[1]
        ))
      }
    }
  }, []);

  return {
    generateBestFitCurve
  }
}