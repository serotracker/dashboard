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

    const bestFitEquationCoefficients = polynomial(
      input.data.map(({ xAxisValue, yAxisValue }) => [xAxisValue - smallestXAxisValue, yAxisValue * 10_000]),
      { order: input.maximumPolynomialOrder }
    )
    return {
      xAxisValueToYAxisValue: (input: { xAxisValue: number }) => {
        return (bestFitEquationCoefficients.predict(input.xAxisValue - smallestXAxisValue)[1] / 10_000)
      }
    }
  }, []);

  return {
    generateBestFitCurve
  }
}