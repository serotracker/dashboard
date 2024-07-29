import { MersEstimate, isAnimalMersEstimate, isHumanMersEstimate } from "./mers-context"
import { doTimeIntervalsOverlap } from "@/lib/date-utils";
import { parseISO } from "date-fns";

export enum MersFilterableField {
  __typename = "__typename",
  whoRegion = "whoRegion",
  unRegion = "unRegion",
  countryAlphaTwoCode = "countryAlphaTwoCode",
  sourceType = "sourceType",
  samplingStartDate = "samplingStartDate",
  samplingEndDate = "samplingEndDate",
  samplingMethod = "samplingMethod",
  assay = "assay",
  specimenType = "specimenType",
  sex = "sex",
  isotypes = "isotypes",
  ageGroup = "ageGroup",
  sampleFrame = "sampleFrame",
  animalDetectionSettings = "animalDetectionSettings",
  animalPurpose = "animalPurpose",
  animalImportedOrLocal = "animalImportedOrLocal",
  diagnosisSource = "diagnosisSource",
  animalType = "animalType",
  animalSpecies = "animalSpecies"
}

interface FilterMersEstimatesInput {
  mersEstimates: MersEstimate[];
  selectedFilters: Partial<Record<MersFilterableField, string[]>>;
}

interface FilterMersEstimatesOutput {
  filteredMersEstimates: MersEstimate[];
}

interface MersEstimateArrayFieldHandlerInput<TFilterKey extends MersFilterableField> {
  filterKey: TFilterKey;
  estimate: {
    primaryEstimateInfo: Record<TFilterKey, string[]> & Record<string, unknown>
  };
  selectedFilters: Record<TFilterKey, string[]>;
}

const mersEstimateArrayFieldHandler = <TFilterKey extends MersFilterableField>(
  input: MersEstimateArrayFieldHandlerInput<TFilterKey>
): boolean => {
  const { selectedFilters, filterKey, estimate } = input;

  if(selectedFilters[filterKey].length === 0) {
    return true;
  }

  return selectedFilters[filterKey].some((valueForFilter) => {
    const valueForEstimate = estimate.primaryEstimateInfo[filterKey];

    return valueForEstimate.includes(valueForFilter);
  });
}

interface MersEstimateStringFieldHandlerInput<TFilterKey extends MersFilterableField> {
  filterKey: TFilterKey;
  estimate: {
    primaryEstimateInfo: Partial<Record<TFilterKey, string | null>> & Record<string, unknown>
  };
  selectedFilters: Record<TFilterKey, string[]>;
}

const mersEstimateStringFieldHandler = <TFilterKey extends MersFilterableField>(
  input: MersEstimateStringFieldHandlerInput<TFilterKey>
): boolean => {
  const { selectedFilters, filterKey, estimate } = input;
  
  if(selectedFilters[filterKey].length === 0) {
    return true;
  }

  return selectedFilters[filterKey].some((valueForFilter) => {
    const valueForEstimate = estimate.primaryEstimateInfo[filterKey];

    return valueForFilter === valueForEstimate;
  });
}

const allMersEstimateHandlers: Record<MersFilterableField, (input: {
  estimate: MersEstimate;
  selectedFilters: Partial<Record<MersFilterableField, string[]>>;
}) => boolean> = {
  [MersFilterableField.__typename]: (input) => {
    if((input.selectedFilters[MersFilterableField.__typename] ?? []).length == 0) {
      return false;
    }

    return mersEstimateStringFieldHandler({
      filterKey: MersFilterableField.__typename,
      estimate: input.estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.__typename]: input.selectedFilters[MersFilterableField.__typename] ?? []
      }
    })
  },
  [MersFilterableField.assay]: (input) => mersEstimateArrayFieldHandler({
    filterKey: MersFilterableField.assay,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [MersFilterableField.assay]: input.selectedFilters[MersFilterableField.assay] ?? []
    }
  }),
  [MersFilterableField.isotypes]: (input) => mersEstimateArrayFieldHandler({
    filterKey: MersFilterableField.isotypes,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [MersFilterableField.isotypes]: input.selectedFilters[MersFilterableField.isotypes] ?? []
    }
  }),
  [MersFilterableField.whoRegion]: (input) => mersEstimateStringFieldHandler({
    filterKey: MersFilterableField.whoRegion,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [MersFilterableField.whoRegion]: input.selectedFilters[MersFilterableField.whoRegion] ?? []
    }
  }),
  [MersFilterableField.sex]: (input) => mersEstimateStringFieldHandler({
    filterKey: MersFilterableField.sex,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [MersFilterableField.sex]: input.selectedFilters[MersFilterableField.sex] ?? []
    }
  }),
  [MersFilterableField.specimenType]: (input) => mersEstimateStringFieldHandler({
    filterKey: MersFilterableField.specimenType,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [MersFilterableField.specimenType]: input.selectedFilters[MersFilterableField.specimenType] ?? []
    }
  }),
  [MersFilterableField.samplingMethod]: (input) => mersEstimateStringFieldHandler({
    filterKey: MersFilterableField.samplingMethod,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [MersFilterableField.samplingMethod]: input.selectedFilters[MersFilterableField.samplingMethod] ?? []
    }
  }),
  [MersFilterableField.sourceType]: (input) => mersEstimateStringFieldHandler({
    filterKey: MersFilterableField.sourceType,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [MersFilterableField.sourceType]: input.selectedFilters[MersFilterableField.sourceType] ?? []
    }
  }),
  [MersFilterableField.countryAlphaTwoCode]: (input) => mersEstimateStringFieldHandler({
    filterKey: MersFilterableField.countryAlphaTwoCode,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [MersFilterableField.countryAlphaTwoCode]: input.selectedFilters[MersFilterableField.countryAlphaTwoCode] ?? []
    }
  }),
  [MersFilterableField.unRegion]: (input) => mersEstimateStringFieldHandler({
    filterKey: MersFilterableField.unRegion,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [MersFilterableField.unRegion]: input.selectedFilters[MersFilterableField.unRegion] ?? []
    }
  }),
  [MersFilterableField.samplingStartDate]: (input) => {
    const samplingStartDateFromFilters = (input.selectedFilters[MersFilterableField.samplingStartDate] ?? []).at(0);

    return doTimeIntervalsOverlap(
      {
        intervalStartDate: samplingStartDateFromFilters ? parseISO(samplingStartDateFromFilters) : undefined,
        intervalEndDate: undefined
      },
      {
        intervalStartDate: input.estimate.primaryEstimateInfo.samplingStartDate
          ? parseISO(input.estimate.primaryEstimateInfo.samplingStartDate)
          : undefined,
        intervalEndDate: input.estimate.primaryEstimateInfo.samplingEndDate
          ? parseISO(input.estimate.primaryEstimateInfo.samplingEndDate)
          : undefined
      }
    )
  },
  [MersFilterableField.samplingEndDate]: (input) => {
    const samplingEndDateFromFilters = (input.selectedFilters[MersFilterableField.samplingEndDate] ?? []).at(0);
    return doTimeIntervalsOverlap(
      {
        intervalStartDate: undefined,
        intervalEndDate: samplingEndDateFromFilters ? parseISO(samplingEndDateFromFilters) : undefined,
      },
      {
        intervalStartDate: input.estimate.primaryEstimateInfo.samplingStartDate
          ? parseISO(input.estimate.primaryEstimateInfo.samplingStartDate)
          : undefined,
        intervalEndDate: input.estimate.primaryEstimateInfo.samplingEndDate
          ? parseISO(input.estimate.primaryEstimateInfo.samplingEndDate)
          : undefined
      }
    )
  },
  [MersFilterableField.animalPurpose]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateStringFieldHandler({
      filterKey: MersFilterableField.animalPurpose,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.animalPurpose]: input.selectedFilters[MersFilterableField.animalPurpose] ?? []
      }
    })
  },
  [MersFilterableField.animalSpecies]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateStringFieldHandler({
      filterKey: MersFilterableField.animalSpecies,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.animalSpecies]: input.selectedFilters[MersFilterableField.animalSpecies] ?? []
      }
    })
  },
  [MersFilterableField.animalImportedOrLocal]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateStringFieldHandler({
      filterKey: MersFilterableField.animalImportedOrLocal,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.animalImportedOrLocal]: input.selectedFilters[MersFilterableField.animalImportedOrLocal] ?? []
      }
    })
  },
  [MersFilterableField.animalType]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.animalType,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.animalType]: input.selectedFilters[MersFilterableField.animalType] ?? []
      }
    })
  },
  [MersFilterableField.animalDetectionSettings]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.animalDetectionSettings,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.animalDetectionSettings]: input.selectedFilters[MersFilterableField.animalDetectionSettings] ?? []
      }
    })
  },
  [MersFilterableField.ageGroup]: (input) => {
    const { estimate } = input;

    if(isAnimalMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.ageGroup,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.ageGroup]: input.selectedFilters[MersFilterableField.ageGroup] ?? []
      }
    })
  },
  [MersFilterableField.sampleFrame]: (input) => {
    const { estimate } = input;

    if(isAnimalMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateStringFieldHandler({
      filterKey: MersFilterableField.sampleFrame,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.sampleFrame]: input.selectedFilters[MersFilterableField.sampleFrame] ?? []
      }
    })
  },
  [MersFilterableField.diagnosisSource]: () => true
}

export const filterMersEstimates = (input: FilterMersEstimatesInput): FilterMersEstimatesOutput => {
  const allAppliedFilterKeys = Object.keys(input.selectedFilters) as MersFilterableField[];

  const filteredMersEstimates = input.mersEstimates.filter((estimate) => allAppliedFilterKeys.every((filterKey) => {
    const filteringFunction = allMersEstimateHandlers[filterKey];

    return filteringFunction({
      estimate,
      selectedFilters: input.selectedFilters
    })
  }));

  return {
    filteredMersEstimates
  };
}