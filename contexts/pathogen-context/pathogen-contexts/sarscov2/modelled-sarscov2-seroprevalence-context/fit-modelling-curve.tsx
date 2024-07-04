
interface FitModellingCurveInput<TGroupingKeyValue extends string> {
  dataPoints: Array<{
    groupingKey: TGroupingKeyValue
    data: Array<{
      xAxisValue: number;
      yAxisValue: number;
    }>
  }>
}

interface FitModellingCurveOutput<TGroupingKeyValue extends string> {
  dataPoints: Array<{
    groupingKey: TGroupingKeyValue
    data: Array<{
      xAxisValue: number;
      rawYAxisValue: number;
      modelledYAxisValue: number;
    }>
  }>
}

export const fitModellingCurve = <TGroupingKeyValue extends string>(input: FitModellingCurveInput<TGroupingKeyValue>): FitModellingCurveOutput<TGroupingKeyValue>  => {
  return { dataPoints: [] }
}