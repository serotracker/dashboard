import { isMersSeroprevalenceSubEstimateInformation, isMersViralSubEstimateInformation, MersSeroprevalenceEstimate, MersSeroprevalenceSubEstimateInformation, MersViralEstimate, MersViralSubEstimateInformation } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context"

interface ReduceViralSubestimateToGenericFieldsInput {
  estimateInfo: {
    positivePrevalence: number;
    positivePrevalence95CILower?: number | undefined | null;
    positivePrevalence95CIUpper?: number | undefined | null;
    sampleNumerator?: number | undefined | null;
    sampleDenominator?: number | undefined | null;
  }
  markedAsFiltered: boolean;
}

const reduceViralSubestimateToGenericFields = (
  input: ReduceViralSubestimateToGenericFieldsInput
): CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields => ({
  prevalence: input.estimateInfo.positivePrevalence,
  prevalence95CILower: input.estimateInfo.positivePrevalence95CILower ?? undefined,
  prevalence95CIUpper: input.estimateInfo.positivePrevalence95CIUpper ?? undefined,
  numerator: input.estimateInfo.sampleNumerator ?? undefined,
  denominator: input.estimateInfo.sampleDenominator ?? undefined,
  markedAsFiltered: input.markedAsFiltered
});

interface ReduceSeroprevalenceSubestimateToGenericFieldsInput {
  estimateInfo: {
    seroprevalence: number;
    seroprevalence95CILower?: number | undefined | null;
    seroprevalence95CIUpper?: number | undefined | null;
    sampleNumerator?: number | undefined | null;
    sampleDenominator?: number | undefined | null;
  };
  markedAsFiltered: boolean;
}

const reduceSeroprevalenceSubestimateToGenericFields = (
  input: ReduceSeroprevalenceSubestimateToGenericFieldsInput
): CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields => ({
  prevalence: input.estimateInfo.seroprevalence,
  prevalence95CILower: input.estimateInfo.seroprevalence95CILower ?? undefined,
  prevalence95CIUpper: input.estimateInfo.seroprevalence95CIUpper ?? undefined,
  numerator: input.estimateInfo.sampleNumerator ?? undefined,
  denominator: input.estimateInfo.sampleDenominator ?? undefined,
  markedAsFiltered: input.markedAsFiltered
});

interface CalculateFilterAdjustedSeroprevalenceForEstimateInput {
  estimate: MersSeroprevalenceEstimate;
}

interface CalculateFilterAdjustedSeroprevalenceForEstimateOutput {
  seroprevalence: number;
  seroprevalence95CILower: number | undefined;
  seroprevalence95CIUpper: number | undefined;
}

const calculateFilterAdjustedSeroprevalenceForEstimate = (
  input: CalculateFilterAdjustedSeroprevalenceForEstimateInput
): CalculateFilterAdjustedSeroprevalenceForEstimateOutput => {
  const { prevalence, prevalence95CILower, prevalence95CIUpper } = calculateFilterAdjustedPrevalenceForGenericEstimate({
    primaryEstimateInfo: {
      prevalence: input.estimate.primaryEstimateInfo.seroprevalence,
      prevalence95CILower: input.estimate.primaryEstimateInfo.seroprevalence95CILower ?? undefined,
      prevalence95CIUpper: input.estimate.primaryEstimateInfo.seroprevalence95CIUpper ?? undefined,
      numerator: input.estimate.primaryEstimateInfo.sampleNumerator ?? undefined,
      denominator: input.estimate.primaryEstimateInfo.sampleDenominator ?? undefined,
    },
    geographicalAreaSubestimates: input.estimate.geographicalAreaSubestimates
      .map((subestimate) => ({ markedAsFiltered: false, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersSeroprevalenceSubEstimateInformation } => isMersSeroprevalenceSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceSeroprevalenceSubestimateToGenericFields(subestimate)),
    ageGroupSubestimates: input.estimate.ageGroupSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersSeroprevalenceSubEstimateInformation } => isMersSeroprevalenceSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceSeroprevalenceSubestimateToGenericFields(subestimate)),
    testUsedSubestimates: input.estimate.testUsedSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersSeroprevalenceSubEstimateInformation } => isMersSeroprevalenceSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceSeroprevalenceSubestimateToGenericFields(subestimate)),
    animalSpeciesSubestimates: input.estimate.animalSpeciesSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersSeroprevalenceSubEstimateInformation } => isMersSeroprevalenceSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceSeroprevalenceSubestimateToGenericFields(subestimate)),
    sexSubestimates: input.estimate.sexSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersSeroprevalenceSubEstimateInformation } => isMersSeroprevalenceSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceSeroprevalenceSubestimateToGenericFields(subestimate)),
    timeFrameSubestimates: input.estimate.timeFrameSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersSeroprevalenceSubEstimateInformation } => isMersSeroprevalenceSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceSeroprevalenceSubestimateToGenericFields(subestimate)),
    sampleTypeSubestimates: input.estimate.sampleTypeSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersSeroprevalenceSubEstimateInformation } => isMersSeroprevalenceSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceSeroprevalenceSubestimateToGenericFields(subestimate)),
    occupationSubestimates: input.estimate.occupationSubestimates
      .map((subestimate) => ({ markedAsFiltered: false, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersSeroprevalenceSubEstimateInformation } => isMersSeroprevalenceSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceSeroprevalenceSubestimateToGenericFields(subestimate)),
    animalSourceLocationSubestimates: input.estimate.animalSourceLocationSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersSeroprevalenceSubEstimateInformation } => isMersSeroprevalenceSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceSeroprevalenceSubestimateToGenericFields(subestimate)),
    animalSamplingContextSubestimates: input.estimate.animalSamplingContextSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersSeroprevalenceSubEstimateInformation } => isMersSeroprevalenceSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceSeroprevalenceSubestimateToGenericFields(subestimate))
  });

  return {
    seroprevalence: prevalence,
    seroprevalence95CILower: prevalence95CILower,
    seroprevalence95CIUpper: prevalence95CIUpper
  }
}

interface CalculateFilterAdjustedViralPositivePrevalenceForEstimateInput {
  estimate: MersViralEstimate;
}

interface CalculateFilterAdjustedViralPositivePrevalenceForEstimateOutput {
  positivePrevalence: number;
  positivePrevalence95CILower: number | undefined;
  positivePrevalence95CIUpper: number | undefined;
}

const calculateFilterAdjustedViralPositivePrevalenceForEstimate = (
  input: CalculateFilterAdjustedViralPositivePrevalenceForEstimateInput
): CalculateFilterAdjustedViralPositivePrevalenceForEstimateOutput => {
  const { prevalence, prevalence95CILower, prevalence95CIUpper } = calculateFilterAdjustedPrevalenceForGenericEstimate({
    primaryEstimateInfo: {
      prevalence: input.estimate.primaryEstimateInfo.positivePrevalence,
      prevalence95CILower: input.estimate.primaryEstimateInfo.positivePrevalence95CILower ?? undefined,
      prevalence95CIUpper: input.estimate.primaryEstimateInfo.positivePrevalence95CIUpper ?? undefined,
      numerator: input.estimate.primaryEstimateInfo.sampleNumerator ?? undefined,
      denominator: input.estimate.primaryEstimateInfo.sampleDenominator ?? undefined,
    },
    geographicalAreaSubestimates: input.estimate.geographicalAreaSubestimates
      .map((subestimate) => ({ markedAsFiltered: false, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersViralSubEstimateInformation } => isMersViralSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceViralSubestimateToGenericFields(subestimate)),
    ageGroupSubestimates: input.estimate.ageGroupSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersViralSubEstimateInformation } => isMersViralSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceViralSubestimateToGenericFields(subestimate)),
    testUsedSubestimates: input.estimate.testUsedSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersViralSubEstimateInformation } => isMersViralSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceViralSubestimateToGenericFields(subestimate)),
    animalSpeciesSubestimates: input.estimate.animalSpeciesSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersViralSubEstimateInformation } => isMersViralSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceViralSubestimateToGenericFields(subestimate)),
    sexSubestimates: input.estimate.sexSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersViralSubEstimateInformation } => isMersViralSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceViralSubestimateToGenericFields(subestimate)),
    timeFrameSubestimates: input.estimate.timeFrameSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersViralSubEstimateInformation } => isMersViralSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceViralSubestimateToGenericFields(subestimate)),
    sampleTypeSubestimates: input.estimate.sampleTypeSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersViralSubEstimateInformation } => isMersViralSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceViralSubestimateToGenericFields(subestimate)),
    occupationSubestimates: input.estimate.occupationSubestimates
      .map((subestimate) => ({ markedAsFiltered: false, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersViralSubEstimateInformation } => isMersViralSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceViralSubestimateToGenericFields(subestimate)),
    animalSourceLocationSubestimates: input.estimate.animalSourceLocationSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersViralSubEstimateInformation } => isMersViralSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceViralSubestimateToGenericFields(subestimate)),
    animalSamplingContextSubestimates: input.estimate.animalSamplingContextSubestimates
      .map((subestimate) => ({ markedAsFiltered: subestimate.markedAsFiltered, estimateInfo: subestimate.estimateInfo }))
      .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersViralSubEstimateInformation } => isMersViralSubEstimateInformation(subestimate.estimateInfo))
      .map((subestimate) => reduceViralSubestimateToGenericFields(subestimate)),
  });

  return {
    positivePrevalence: prevalence,
    positivePrevalence95CILower: prevalence95CILower,
    positivePrevalence95CIUpper: prevalence95CIUpper
  }
}

interface CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields {
  prevalence: number;
  prevalence95CILower: number | undefined;
  prevalence95CIUpper: number | undefined;
  numerator: number | undefined;
  denominator: number | undefined;
  markedAsFiltered: boolean;
}

interface CalculateFilterAdjustedPrevalenceForGenericEstimateInput {
  primaryEstimateInfo: {
    prevalence: number;
    prevalence95CILower: number | undefined;
    prevalence95CIUpper: number | undefined;
    numerator: number | undefined;
    denominator: number | undefined;
  };
  geographicalAreaSubestimates: Array<CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields>;
  ageGroupSubestimates: Array<CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields>;
  testUsedSubestimates: Array<CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields>;
  animalSpeciesSubestimates: Array<CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields>;
  sexSubestimates: Array<CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields>;
  timeFrameSubestimates: Array<CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields>;
  sampleTypeSubestimates: Array<CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields>;
  occupationSubestimates: Array<CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields>;
  animalSourceLocationSubestimates: Array<CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields>;
  animalSamplingContextSubestimates: Array<CalculateFilterAdjustedPrevalenceForGenericEstimateSubestimateFields>;
}

interface CalculateFilterAdjustedPrevalenceForGenericEstimateOutput {
  prevalence: number;
  prevalence95CILower: number | undefined;
  prevalence95CIUpper: number | undefined;
}

const calculateFilterAdjustedPrevalenceForGenericEstimate = (
  input: CalculateFilterAdjustedPrevalenceForGenericEstimateInput
): CalculateFilterAdjustedPrevalenceForGenericEstimateOutput => {
  return {
    prevalence: input.primaryEstimateInfo.prevalence,
    prevalence95CILower: input.primaryEstimateInfo.prevalence95CILower,
    prevalence95CIUpper: input.primaryEstimateInfo.prevalence95CIUpper,
  }
}