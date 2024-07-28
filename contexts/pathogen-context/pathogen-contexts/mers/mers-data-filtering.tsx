import { FilterableField } from "@/components/customs/filters/available-filters"
import { MersEstimate, isAnimalMersEstimate, isHumanMersEstimate } from "./mers-context"
import { typedObjectKeys } from "@/lib/utils";
import { doTimeIntervalsOverlap } from "@/lib/date-utils";
import { parseISO } from "date-fns";

export type MersFilterableField =
  | FilterableField.__typename
  | FilterableField.whoRegion
  | FilterableField.unRegion
  | FilterableField.countryAlphaTwoCode
  | FilterableField.sourceType
  | FilterableField.samplingStartDate
  | FilterableField.samplingEndDate
  | FilterableField.samplingMethod
  | FilterableField.assay
  | FilterableField.specimenType
  | FilterableField.sex
  | FilterableField.isotypes
  | FilterableField.ageGroup
  | FilterableField.sampleFrame
  | FilterableField.animalDetectionSettings
  | FilterableField.animalPurpose
  | FilterableField.animalImportedOrLocal
  | FilterableField.diagnosisSource
  | FilterableField.animalType
  | FilterableField.animalSpecies

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
  [FilterableField.__typename]: (input) => {
    if((input.selectedFilters[FilterableField.__typename] ?? []).length == 0) {
      return false;
    }

    return mersEstimateStringFieldHandler({
      filterKey: FilterableField.__typename,
      estimate: input.estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [FilterableField.__typename]: input.selectedFilters[FilterableField.__typename] ?? []
      }
    })
  },
  [FilterableField.assay]: (input) => mersEstimateArrayFieldHandler({
    filterKey: FilterableField.assay,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [FilterableField.assay]: input.selectedFilters[FilterableField.assay] ?? []
    }
  }),
  [FilterableField.isotypes]: (input) => mersEstimateArrayFieldHandler({
    filterKey: FilterableField.isotypes,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [FilterableField.isotypes]: input.selectedFilters[FilterableField.isotypes] ?? []
    }
  }),
  [FilterableField.whoRegion]: (input) => mersEstimateStringFieldHandler({
    filterKey: FilterableField.whoRegion,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [FilterableField.whoRegion]: input.selectedFilters[FilterableField.whoRegion] ?? []
    }
  }),
  [FilterableField.sex]: (input) => mersEstimateStringFieldHandler({
    filterKey: FilterableField.sex,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [FilterableField.sex]: input.selectedFilters[FilterableField.sex] ?? []
    }
  }),
  [FilterableField.specimenType]: (input) => mersEstimateStringFieldHandler({
    filterKey: FilterableField.specimenType,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [FilterableField.specimenType]: input.selectedFilters[FilterableField.specimenType] ?? []
    }
  }),
  [FilterableField.samplingMethod]: (input) => mersEstimateStringFieldHandler({
    filterKey: FilterableField.samplingMethod,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [FilterableField.samplingMethod]: input.selectedFilters[FilterableField.samplingMethod] ?? []
    }
  }),
  [FilterableField.sourceType]: (input) => mersEstimateStringFieldHandler({
    filterKey: FilterableField.sourceType,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [FilterableField.sourceType]: input.selectedFilters[FilterableField.sourceType] ?? []
    }
  }),
  [FilterableField.countryAlphaTwoCode]: (input) => mersEstimateStringFieldHandler({
    filterKey: FilterableField.countryAlphaTwoCode,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [FilterableField.countryAlphaTwoCode]: input.selectedFilters[FilterableField.countryAlphaTwoCode] ?? []
    }
  }),
  [FilterableField.unRegion]: (input) => mersEstimateStringFieldHandler({
    filterKey: FilterableField.unRegion,
    estimate: input.estimate,
    selectedFilters: {
      ...input.selectedFilters,
      [FilterableField.unRegion]: input.selectedFilters[FilterableField.unRegion] ?? []
    }
  }),
  [FilterableField.samplingStartDate]: (input) => {
    const samplingStartDateFromFilters = (input.selectedFilters[FilterableField.samplingStartDate] ?? []).at(0);

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
  [FilterableField.samplingEndDate]: (input) => {
    const samplingEndDateFromFilters = (input.selectedFilters[FilterableField.samplingEndDate] ?? []).at(0);
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
  [FilterableField.animalPurpose]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateStringFieldHandler({
      filterKey: FilterableField.animalPurpose,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [FilterableField.animalPurpose]: input.selectedFilters[FilterableField.animalPurpose] ?? []
      }
    })
  },
  [FilterableField.animalSpecies]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateStringFieldHandler({
      filterKey: FilterableField.animalSpecies,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [FilterableField.animalSpecies]: input.selectedFilters[FilterableField.animalSpecies] ?? []
      }
    })
  },
  [FilterableField.animalImportedOrLocal]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateStringFieldHandler({
      filterKey: FilterableField.animalImportedOrLocal,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [FilterableField.animalImportedOrLocal]: input.selectedFilters[FilterableField.animalImportedOrLocal] ?? []
      }
    })
  },
  [FilterableField.animalType]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateArrayFieldHandler({
      filterKey: FilterableField.animalType,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [FilterableField.animalType]: input.selectedFilters[FilterableField.animalType] ?? []
      }
    })
  },
  [FilterableField.animalDetectionSettings]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateArrayFieldHandler({
      filterKey: FilterableField.animalDetectionSettings,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [FilterableField.animalDetectionSettings]: input.selectedFilters[FilterableField.animalDetectionSettings] ?? []
      }
    })
  },
  [FilterableField.ageGroup]: (input) => {
    const { estimate } = input;

    if(isAnimalMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateArrayFieldHandler({
      filterKey: FilterableField.ageGroup,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [FilterableField.ageGroup]: input.selectedFilters[FilterableField.ageGroup] ?? []
      }
    })
  },
  [FilterableField.sampleFrame]: (input) => {
    const { estimate } = input;

    if(isAnimalMersEstimate(estimate)) {
      return true;
    }

    return mersEstimateStringFieldHandler({
      filterKey: FilterableField.sampleFrame,
      estimate: estimate,
      selectedFilters: {
        ...input.selectedFilters,
        [FilterableField.sampleFrame]: input.selectedFilters[FilterableField.sampleFrame] ?? []
      }
    })
  },
  [FilterableField.diagnosisSource]: () => true
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