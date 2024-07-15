import { SarsCov2Estimate } from "../sc2-context";

type AcceptableSarsCov2EstimateWithSeroprevalence = Omit<SarsCov2Estimate, "samplingMidDate"|"denominatorValue"|"numeratorValue"|"seroprevalence"> & {
  samplingMidDate: NonNullable<SarsCov2Estimate["samplingMidDate"]>;
  denominatorValue: NonNullable<SarsCov2Estimate["denominatorValue"]>;
} & {
  numeratorValue: SarsCov2Estimate["numeratorValue"];
  seroprevalence: NonNullable<SarsCov2Estimate["seroprevalence"]>;
}

export const isAcceptableSarsCov2EstimateWithSeroprevalence = (estimate: AcceptableSarsCov2Estimate): estimate is AcceptableSarsCov2EstimateWithSeroprevalence =>
  estimate.seroprevalence !== null && estimate.seroprevalence !== undefined;

type AcceptableSarsCov2EstimateWithNumerator = Omit<SarsCov2Estimate, "samplingMidDate"|"denominatorValue"|"numeratorValue"|"seroprevalence"> & {
  samplingMidDate: NonNullable<SarsCov2Estimate["samplingMidDate"]>;
  denominatorValue: NonNullable<SarsCov2Estimate["denominatorValue"]>;
} & {
  numeratorValue: NonNullable<SarsCov2Estimate["numeratorValue"]>;
  seroprevalence: SarsCov2Estimate["seroprevalence"]
}

export const isAcceptableSarsCov2EstimateWithNumerator = (estimate: AcceptableSarsCov2Estimate): estimate is AcceptableSarsCov2EstimateWithNumerator =>
  estimate.numeratorValue !== null && estimate.numeratorValue !== undefined;

export type AcceptableSarsCov2Estimate = AcceptableSarsCov2EstimateWithSeroprevalence | AcceptableSarsCov2EstimateWithNumerator;

interface FilterDataForSarsCov2SeroprevalenceModellingInput {
  data: SarsCov2Estimate[];
}

interface FilterDataForSarsCov2SeroprevalenceModellingOutput {
  filteredDataForModelling: AcceptableSarsCov2Estimate[];
}

export const filterDataForSarsCov2SeroprevalenceModelling = (input: FilterDataForSarsCov2SeroprevalenceModellingInput): FilterDataForSarsCov2SeroprevalenceModellingOutput => {
  const filteredDataForModelling = input.data
    .filter((dataPoint) =>
      (dataPoint.scope && [
        'National',
        'Regional'
      ].includes(dataPoint.scope)) &&
      (dataPoint.riskOfBias && [
        'Low',
        'Moderate'
      ].includes(dataPoint.riskOfBias)) && 
      (dataPoint.populationGroup && [
        'Blood donors',
        'Household and community samples',
        'Multiple general populations',
        'Persons living in slums',
        'Pregnant or parturient women',
        'Representative patient population',
        'Residual sera'
      ].includes(dataPoint.populationGroup))
    )
    .filter((dataPoint: SarsCov2Estimate): dataPoint is AcceptableSarsCov2Estimate => 
        !!dataPoint.samplingMidDate
        && dataPoint.denominatorValue !== null && dataPoint.denominatorValue !== undefined
        && (
          (dataPoint.numeratorValue !== null && dataPoint.numeratorValue !== undefined)
          || (dataPoint.seroprevalence !== null && dataPoint.seroprevalence !== undefined)
        )
    );

  return {
    filteredDataForModelling
  }
}