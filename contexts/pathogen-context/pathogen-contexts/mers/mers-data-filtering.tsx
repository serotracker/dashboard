import { HumanMersAgeGroupSubEstimate, MersEstimate, isAnimalMersEstimate, isHumanMersAgeGroupSubEstimate, isHumanMersEstimate } from "./mers-context"
import { doTimeIntervalsOverlap } from "@/lib/date-utils";
import { parseISO } from "date-fns";
import uniq from "lodash/uniq";

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
  animalSpecies = "animalSpecies",
  antigen = "antigen",
  exposureToCamels = "exposureToCamels"
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
  estimate: Record<TFilterKey, string[]> & Record<string, unknown>;
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
    const valueForEstimate = estimate[filterKey];

    return valueForEstimate.includes(valueForFilter);
  });
}

interface MersEstimateStringFieldHandlerInput<TFilterKey extends MersFilterableField> {
  filterKey: TFilterKey;
  estimate: Partial<Record<TFilterKey, string | null>> & Record<string, unknown>;
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
    const valueForEstimate = estimate[filterKey];

    return valueForFilter === valueForEstimate;
  });
}

interface MersEstimateFilteringHandlerOutput {
  included: boolean;
  sexSubestimateIdsToMarkAsFiltered?: string[];
  humanAgeGroupSubestimateIdsToMarkAsFiltered?: string[];
  animalSpeciesSubestimateIdstoMarkAsFiltered?: string[];
  testUsedSubestimateIdstoMarkAsFiltered?: string[];
  timeFrameSubestimateIdsToMarkAsFiltered?: string[];
  sampleTypeSubestimateIdsToMarkAsFiltered?: string[];
  animalSourceLocationSubestimateIdsToMarkAsFiltered?: string[];
  animalSamplingContextSubestimateIdsToMarkAsFiltered?: string[];
  occupationSubestimateIdsToMarkAsFiltered?: string[];
  camelExposureLevelSubestimateIdsToMarkAsFiltered?: string[];
}

const allMersEstimateHandlers: Record<MersFilterableField, (input: {
  estimate: MersEstimate;
  selectedFilters: Partial<Record<MersFilterableField, string[]>>;
}) => MersEstimateFilteringHandlerOutput> = {
  [MersFilterableField.__typename]: (input) => {
    if((input.selectedFilters[MersFilterableField.__typename] ?? []).length == 0) {
      return { included: false };
    }

    return {
      included: mersEstimateStringFieldHandler({
        filterKey: MersFilterableField.__typename,
        estimate: {
          ...input.estimate,
          __typename: input.estimate.primaryEstimateInfo.__typename
        },
        selectedFilters: {
          ...input.selectedFilters,
          [MersFilterableField.__typename]: input.selectedFilters[MersFilterableField.__typename] ?? []
        }
      })
    }
  },
  [MersFilterableField.assay]: (input) => ({
    included: mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.assay,
      estimate: {
        ...input.estimate,
        assay: [
          ...input.estimate.primaryEstimateInfo.assay,
          ...input.estimate.testUsedSubestimates
            .flatMap((subestimate) => subestimate.assay)
        ]
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.assay]: input.selectedFilters[MersFilterableField.assay] ?? []
      }
    }),
    testUsedSubestimateIdstoMarkAsFiltered: input.estimate.testUsedSubestimates
      .filter((subestimate) =>
        ((input.selectedFilters[MersFilterableField.assay] ?? []).length > 0) &&
        !input.selectedFilters[MersFilterableField.assay]?.some((element) => subestimate.assay.includes(element))
      )
      .map((subestimate) => subestimate.id)
  }),
  [MersFilterableField.antigen]: (input) => ({
    included: mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.antigen,
      estimate: {
        ...input.estimate,
        antigen: input.estimate.primaryEstimateInfo.antigen
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.antigen]: input.selectedFilters[MersFilterableField.antigen] ?? []
      }
    })
  }),
  [MersFilterableField.exposureToCamels]: (input) => ({
    included: mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.exposureToCamels,
      estimate: {
        ...input.estimate,
        exposureToCamels: [
          input.estimate.primaryEstimateInfo.exposureToCamels,
          ...input.estimate.occupationSubestimates.map((subestimate) => subestimate.exposureToCamels),
          ...input.estimate.camelExposureLevelSubestimates.map((subestimate) => subestimate.exposureToCamels)
        ].filter((element): element is NonNullable<typeof element> => !!element)
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.exposureToCamels]: input.selectedFilters[MersFilterableField.exposureToCamels] ?? []
      }
    }),
    occupationSubestimateIdsToMarkAsFiltered: input.estimate.occupationSubestimates
      .filter((subestimate) =>
        ((input.selectedFilters[MersFilterableField.exposureToCamels] ?? []).length > 0) && (
          !subestimate.exposureToCamels ||
          !input.selectedFilters[MersFilterableField.exposureToCamels]?.includes(subestimate.exposureToCamels)
        )
      )
      .map((subestimate) => subestimate.id),
    camelExposureLevelSubestimateIdsToMarkAsFiltered: input.estimate.camelExposureLevelSubestimates
      .filter((subestimate) =>
        ((input.selectedFilters[MersFilterableField.exposureToCamels] ?? []).length > 0) && (
          !subestimate.exposureToCamels ||
          !input.selectedFilters[MersFilterableField.exposureToCamels]?.includes(subestimate.exposureToCamels)
        )
      )
      .map((subestimate) => subestimate.id)
  }),
  [MersFilterableField.isotypes]: (input) => ({
    included: mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.isotypes,
      estimate: {
        ...input.estimate,
        isotypes: input.estimate.primaryEstimateInfo.isotypes
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.isotypes]: input.selectedFilters[MersFilterableField.isotypes] ?? []
      }
    })
  }),
  [MersFilterableField.whoRegion]: (input) => ({
    included: mersEstimateStringFieldHandler({
      filterKey: MersFilterableField.whoRegion,
      estimate: {
        ...input.estimate,
        whoRegion: input.estimate.primaryEstimateInfo.whoRegion
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.whoRegion]: input.selectedFilters[MersFilterableField.whoRegion] ?? []
      }
    })
  }),
  [MersFilterableField.sex]: (input) => ({
    included: mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.sex,
      estimate: {
        ...input.estimate,
        sex: [
          input.estimate.primaryEstimateInfo.sex,
          ...input.estimate.sexSubestimates.map((subestimate) => subestimate.sex)
        ].filter((element): element is NonNullable<typeof element> => !!element)
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.sex]: input.selectedFilters[MersFilterableField.sex] ?? []
      }
    }),
    sexSubestimateIdsToMarkAsFiltered: input.estimate.sexSubestimates
      .filter((subestimate) =>
        ((input.selectedFilters[MersFilterableField.sex] ?? []).length > 0) &&
        !input.selectedFilters[MersFilterableField.sex]?.includes(subestimate.sex)
      )
      .map((subestimate) => subestimate.id)
  }),
  [MersFilterableField.specimenType]: (input) => ({
    included: mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.specimenType,
      estimate: {
        ...input.estimate,
        specimenType: uniq([
          ...input.estimate.primaryEstimateInfo.specimenType,
          ...input.estimate.sampleTypeSubestimates
            .flatMap((subestimate) => subestimate.specimenType)
        ])
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.specimenType]: input.selectedFilters[MersFilterableField.specimenType] ?? []
      }
    }),
    sampleTypeSubestimateIdsToMarkAsFiltered: input.estimate.sampleTypeSubestimates
      .filter((subestimate) =>
        ((input.selectedFilters[MersFilterableField.specimenType] ?? []).length > 0) &&
        !input.selectedFilters[MersFilterableField.specimenType]?.some((element) => subestimate.specimenType.includes(element))
      )
      .map((subestimate) => subestimate.id)
  }),
  [MersFilterableField.samplingMethod]: (input) => ({
    included: mersEstimateStringFieldHandler({
      filterKey: MersFilterableField.samplingMethod,
      estimate: {
        ...input.estimate,
        samplingMethod: input.estimate.primaryEstimateInfo.samplingMethod
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.samplingMethod]: input.selectedFilters[MersFilterableField.samplingMethod] ?? []
      }
    })
  }),
  [MersFilterableField.sourceType]: (input) => ({
    included: mersEstimateStringFieldHandler({
      filterKey: MersFilterableField.sourceType,
      estimate: {
        ...input.estimate,
        sourceType: input.estimate.primaryEstimateInfo.sourceType
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.sourceType]: input.selectedFilters[MersFilterableField.sourceType] ?? []
      }
    })
  }),
  [MersFilterableField.countryAlphaTwoCode]: (input) => ({
    included: mersEstimateStringFieldHandler({
      filterKey: MersFilterableField.countryAlphaTwoCode,
      estimate: {
        ...input.estimate,
        countryAlphaTwoCode: input.estimate.primaryEstimateInfo.countryAlphaTwoCode
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.countryAlphaTwoCode]: input.selectedFilters[MersFilterableField.countryAlphaTwoCode] ?? []
      }
    })
  }),
  [MersFilterableField.unRegion]: (input) => ({
    included: mersEstimateStringFieldHandler({
      filterKey: MersFilterableField.unRegion,
      estimate: {
        ...input.estimate,
        unRegion: input.estimate.primaryEstimateInfo.unRegion
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.unRegion]: input.selectedFilters[MersFilterableField.unRegion] ?? []
      }
    })
  }),
  [MersFilterableField.samplingStartDate]: (input) => {
    const samplingStartDateFromFilters = (input.selectedFilters[MersFilterableField.samplingStartDate] ?? []).at(0);

    const primaryEstimateSamplingStartDate = input.estimate.primaryEstimateInfo.samplingStartDate;
    const primaryEstimateSamplingEndDate = input.estimate.primaryEstimateInfo.samplingEndDate;

    const included = doTimeIntervalsOverlap(
      {
        intervalStartDate: samplingStartDateFromFilters ? parseISO(samplingStartDateFromFilters) : undefined,
        intervalEndDate: undefined
      },
      {
        intervalStartDate: primaryEstimateSamplingStartDate ? parseISO(primaryEstimateSamplingStartDate) : undefined,
        intervalEndDate: primaryEstimateSamplingEndDate ? parseISO(primaryEstimateSamplingEndDate) : undefined
      }
    )

    return {
      included,
      timeFrameSubestimateIdsToMarkAsFiltered: input.estimate.timeFrameSubestimates
        .filter((subestimate) =>
          ((input.selectedFilters[MersFilterableField.samplingStartDate] ?? []).length > 0) &&
          !doTimeIntervalsOverlap({
            intervalStartDate: samplingStartDateFromFilters ? parseISO(samplingStartDateFromFilters) : undefined,
            intervalEndDate: undefined
          }, {
            intervalStartDate: subestimate.samplingStartDate ? parseISO(subestimate.samplingStartDate) : undefined,
            intervalEndDate: subestimate.samplingEndDate ? parseISO(subestimate.samplingEndDate) : undefined
          })
        )
        .map((subestimate) => subestimate.id)
    }
  },
  [MersFilterableField.samplingEndDate]: (input) => {
    const samplingEndDateFromFilters = (input.selectedFilters[MersFilterableField.samplingEndDate] ?? []).at(0);

    const primaryEstimateSamplingStartDate = input.estimate.primaryEstimateInfo.samplingStartDate;
    const primaryEstimateSamplingEndDate = input.estimate.primaryEstimateInfo.samplingEndDate;

    const included = doTimeIntervalsOverlap(
      {
        intervalStartDate: undefined,
        intervalEndDate: samplingEndDateFromFilters ? parseISO(samplingEndDateFromFilters) : undefined,
      },
      {
        intervalStartDate: primaryEstimateSamplingStartDate ? parseISO(primaryEstimateSamplingStartDate) : undefined,
        intervalEndDate: primaryEstimateSamplingEndDate ? parseISO(primaryEstimateSamplingEndDate) : undefined
      }
    )

    return {
      included,
      timeFrameSubestimateIdsToMarkAsFiltered: input.estimate.timeFrameSubestimates
        .filter((subestimate) =>
          ((input.selectedFilters[MersFilterableField.samplingEndDate] ?? []).length > 0) &&
          !doTimeIntervalsOverlap({
            intervalStartDate: undefined,
            intervalEndDate: samplingEndDateFromFilters ? parseISO(samplingEndDateFromFilters) : undefined,
          }, {
            intervalStartDate: subestimate.samplingStartDate ? parseISO(subestimate.samplingStartDate) : undefined,
            intervalEndDate: subestimate.samplingEndDate ? parseISO(subestimate.samplingEndDate) : undefined
          })
        )
        .map((subestimate) => subestimate.id)
    }
  },
  [MersFilterableField.animalPurpose]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return { included: true};
    }

    const included = mersEstimateStringFieldHandler({
      filterKey: MersFilterableField.animalPurpose,
      estimate: {
        ...estimate,
        animalPurpose: estimate.primaryEstimateInfo.animalPurpose
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.animalPurpose]: input.selectedFilters[MersFilterableField.animalPurpose] ?? []
      }
    })

    return {
      included
    }
  },
  [MersFilterableField.animalSpecies]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return { included: true };
    }

    const included = mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.animalSpecies,
      estimate: {
        ...estimate,
        animalSpecies: [
          estimate.primaryEstimateInfo.animalSpecies,
          ...input.estimate.animalSpeciesSubestimates.map((subestimate) => subestimate.animalSpecies)
        ].filter((element): element is NonNullable<typeof element> => !!element)
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.animalSpecies]: input.selectedFilters[MersFilterableField.animalSpecies] ?? []
      }
    })

    return {
      included,
      animalSpeciesSubestimateIdstoMarkAsFiltered: input.estimate.animalSpeciesSubestimates
        .filter((subestimate) =>
          ((input.selectedFilters[MersFilterableField.animalSpecies] ?? []).length > 0) &&
          !input.selectedFilters[MersFilterableField.animalSpecies]?.includes(subestimate.animalSpecies)
        )
        .map((subestimate) => subestimate.id)
    }
  },
  [MersFilterableField.animalImportedOrLocal]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return { included: true };
    }

    const included = mersEstimateStringFieldHandler({
      filterKey: MersFilterableField.animalImportedOrLocal,
      estimate: {
        ...estimate,
        animalImportedOrLocal: estimate.primaryEstimateInfo.animalImportedOrLocal
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.animalImportedOrLocal]: input.selectedFilters[MersFilterableField.animalImportedOrLocal] ?? []
      }
    })

    return {
      included,
      animalSourceLocationSubestimateIdsToMarkAsFiltered: input.estimate.animalSourceLocationSubestimates
        .filter((subestimate) =>
          ((input.selectedFilters[MersFilterableField.animalImportedOrLocal] ?? []).length > 0) &&
          !input.selectedFilters[MersFilterableField.animalImportedOrLocal]?.includes(subestimate.animalImportedOrLocal)
        )
        .map((subestimate) => subestimate.id)
    }
  },
  [MersFilterableField.animalType]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return { included: true };
    }

    const included = mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.animalType,
      estimate: {
        ...estimate,
        animalType: estimate.primaryEstimateInfo.animalType
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.animalType]: input.selectedFilters[MersFilterableField.animalType] ?? []
      }
    })

    return {
      included
    }
  },
  [MersFilterableField.animalDetectionSettings]: (input) => {
    const { estimate } = input;

    if(isHumanMersEstimate(estimate)) {
      return { included: true };
    }

    const included = mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.animalDetectionSettings,
      estimate: {
        ...estimate,
        animalDetectionSettings: uniq([
          ...estimate.primaryEstimateInfo.animalDetectionSettings,
          ...estimate.animalSamplingContextSubestimates.flatMap((subestimate) => subestimate.animalDetectionSettings)
        ])
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.animalDetectionSettings]: input.selectedFilters[MersFilterableField.animalDetectionSettings] ?? []
      }
    })

    return {
      included,
      animalSamplingContextSubestimateIdsToMarkAsFiltered: input.estimate.animalSamplingContextSubestimates
        .filter((subestimate) =>
          ((input.selectedFilters[MersFilterableField.animalDetectionSettings] ?? []).length > 0) &&
          !input.selectedFilters[MersFilterableField.animalDetectionSettings]?.some(
            (element) => subestimate.animalDetectionSettings.includes(element)
          )
        )
        .map((subestimate) => subestimate.id)
    }
  },
  [MersFilterableField.ageGroup]: (input) => {
    const { estimate } = input;

    if(isAnimalMersEstimate(estimate)) {
      return { included: true };
    }

    const included = mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.ageGroup,
      estimate: {
        ...estimate,
        ageGroup: [
          ...estimate.primaryEstimateInfo.ageGroup,
          ...input.estimate.ageGroupSubestimates
            .filter((subestimate): subestimate is HumanMersAgeGroupSubEstimate => isHumanMersAgeGroupSubEstimate(subestimate))
            .flatMap((subestimate) => subestimate.ageGroup)
        ]
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.ageGroup]: input.selectedFilters[MersFilterableField.ageGroup] ?? []
      }
    })

    return {
      included,
      humanAgeGroupSubestimateIdsToMarkAsFiltered: input.estimate.ageGroupSubestimates
        .filter((subestimate): subestimate is HumanMersAgeGroupSubEstimate => isHumanMersAgeGroupSubEstimate(subestimate))
        .filter((subestimate) =>
          ((input.selectedFilters[MersFilterableField.ageGroup] ?? []).length > 0) &&
          !input.selectedFilters[MersFilterableField.ageGroup]?.some((element) => subestimate.ageGroup.includes(element))
        )
        .map((subestimate) => subestimate.id)
    }
  },
  [MersFilterableField.sampleFrame]: (input) => {
    const { estimate } = input;

    if(isAnimalMersEstimate(estimate)) {
      return { included: true };
    }

    const included = mersEstimateArrayFieldHandler({
      filterKey: MersFilterableField.sampleFrame,
      estimate: {
        ...estimate,
        sampleFrame: [
          ...(estimate.primaryEstimateInfo.sampleFrame ? [estimate.primaryEstimateInfo.sampleFrame] : []),
          ...estimate.camelExposureLevelSubestimates.map((subestimate) => subestimate.sampleFrame)
        ]
      },
      selectedFilters: {
        ...input.selectedFilters,
        [MersFilterableField.sampleFrame]: input.selectedFilters[MersFilterableField.sampleFrame] ?? []
      }
    })

    return {
      included,
      camelExposureLevelSubestimateIdsToMarkAsFiltered: input.estimate.camelExposureLevelSubestimates
        .filter((subestimate) =>
          ((input.selectedFilters[MersFilterableField.sampleFrame] ?? []).length > 0) && (
            !subestimate.sampleFrame ||
            !input.selectedFilters[MersFilterableField.sampleFrame]?.includes(subestimate.sampleFrame)
          )
        )
        .map((subestimate) => subestimate.id)
    }
  },
  [MersFilterableField.diagnosisSource]: () => ({ included: true })
}

export const filterMersEstimates = (input: FilterMersEstimatesInput): FilterMersEstimatesOutput => {
  const allAppliedFilterKeys = Object.keys(input.selectedFilters) as MersFilterableField[];

  const filteredMersEstimates = input.mersEstimates
    .map((estimate) => ({
      estimate,
      appliedFilters: allAppliedFilterKeys.map((filterKey) => {
        const filteringFunction = allMersEstimateHandlers[filterKey];

        const {
          included,
          sexSubestimateIdsToMarkAsFiltered,
          humanAgeGroupSubestimateIdsToMarkAsFiltered,
          animalSpeciesSubestimateIdstoMarkAsFiltered,
          testUsedSubestimateIdstoMarkAsFiltered,
          timeFrameSubestimateIdsToMarkAsFiltered,
          sampleTypeSubestimateIdsToMarkAsFiltered,
          animalSourceLocationSubestimateIdsToMarkAsFiltered,
          animalSamplingContextSubestimateIdsToMarkAsFiltered,
          occupationSubestimateIdsToMarkAsFiltered,
          camelExposureLevelSubestimateIdsToMarkAsFiltered
        } = filteringFunction({
          estimate,
          selectedFilters: input.selectedFilters
        })

        return {
          included,
          sexSubestimateIdsToMarkAsFiltered,
          humanAgeGroupSubestimateIdsToMarkAsFiltered,
          animalSpeciesSubestimateIdstoMarkAsFiltered,
          testUsedSubestimateIdstoMarkAsFiltered,
          timeFrameSubestimateIdsToMarkAsFiltered,
          sampleTypeSubestimateIdsToMarkAsFiltered,
          animalSourceLocationSubestimateIdsToMarkAsFiltered,
          animalSamplingContextSubestimateIdsToMarkAsFiltered,
          occupationSubestimateIdsToMarkAsFiltered,
          camelExposureLevelSubestimateIdsToMarkAsFiltered
        }
      })
    }))
    .filter(({ appliedFilters }) => appliedFilters.every((appliedFilter) => appliedFilter.included))
    .map(({ estimate, appliedFilters }) => ({
      estimate,
      sexSubestimateIdsToMarkAsFiltered: uniq(
        appliedFilters.flatMap(({ sexSubestimateIdsToMarkAsFiltered }) => sexSubestimateIdsToMarkAsFiltered)
      ),
      ageGroupSubestimateIdsToMarkAsFiltered: uniq(
        appliedFilters.flatMap(({ humanAgeGroupSubestimateIdsToMarkAsFiltered }) => humanAgeGroupSubestimateIdsToMarkAsFiltered)
      ),
      animalSpeciesSubestimateIdstoMarkAsFiltered: uniq(
        appliedFilters.flatMap(({ animalSpeciesSubestimateIdstoMarkAsFiltered }) => animalSpeciesSubestimateIdstoMarkAsFiltered)
      ),
      testUsedSubestimateIdstoMarkAsFiltered: uniq(
        appliedFilters.flatMap(({ testUsedSubestimateIdstoMarkAsFiltered }) => testUsedSubestimateIdstoMarkAsFiltered)
      ),
      timeFrameSubestimateIdsToMarkAsFiltered: uniq(
        appliedFilters.flatMap(({ timeFrameSubestimateIdsToMarkAsFiltered }) => timeFrameSubestimateIdsToMarkAsFiltered)
      ),
      sampleTypeSubestimateIdsToMarkAsFiltered: uniq(
        appliedFilters.flatMap(({ sampleTypeSubestimateIdsToMarkAsFiltered }) => sampleTypeSubestimateIdsToMarkAsFiltered)
      ),
      animalSourceLocationSubestimateIdsToMarkAsFiltered: uniq(
        appliedFilters.flatMap(({ animalSourceLocationSubestimateIdsToMarkAsFiltered }) => animalSourceLocationSubestimateIdsToMarkAsFiltered)
      ),
      animalSamplingContextSubestimateIdsToMarkAsFiltered: uniq(
        appliedFilters.flatMap(({ animalSamplingContextSubestimateIdsToMarkAsFiltered }) => animalSamplingContextSubestimateIdsToMarkAsFiltered)
      ),
      occupationSubestimateIdsToMarkAsFiltered: uniq(
        appliedFilters.flatMap(({ occupationSubestimateIdsToMarkAsFiltered }) => occupationSubestimateIdsToMarkAsFiltered)
      ),
      camelExposureLevelSubestimateIdsToMarkAsFiltered: uniq(
        appliedFilters.flatMap(({ camelExposureLevelSubestimateIdsToMarkAsFiltered }) => camelExposureLevelSubestimateIdsToMarkAsFiltered)
      )
    }))
    .map(({
      estimate,
      sexSubestimateIdsToMarkAsFiltered,
      ageGroupSubestimateIdsToMarkAsFiltered,
      animalSpeciesSubestimateIdstoMarkAsFiltered,
      testUsedSubestimateIdstoMarkAsFiltered,
      timeFrameSubestimateIdsToMarkAsFiltered,
      sampleTypeSubestimateIdsToMarkAsFiltered,
      animalSourceLocationSubestimateIdsToMarkAsFiltered,
      animalSamplingContextSubestimateIdsToMarkAsFiltered,
      occupationSubestimateIdsToMarkAsFiltered,
      camelExposureLevelSubestimateIdsToMarkAsFiltered
    }) => ({
      ...estimate,
      sexSubestimates: estimate.sexSubestimates.map((subestimate) => ({
        ...subestimate,
        markedAsFiltered: sexSubestimateIdsToMarkAsFiltered.includes(subestimate.id)
      })),
      ageGroupSubestimates: estimate.ageGroupSubestimates.map((subestimate) => ({
        ...subestimate,
        markedAsFiltered: ageGroupSubestimateIdsToMarkAsFiltered.includes(subestimate.id)
      })),
      animalSpeciesSubestimates: estimate.animalSpeciesSubestimates.map((subestimate) => ({
        ...subestimate,
        markedAsFiltered: animalSpeciesSubestimateIdstoMarkAsFiltered.includes(subestimate.id)
      })),
      testUsedSubestimates: estimate.testUsedSubestimates.map((subestimate) => ({
        ...subestimate,
        markedAsFiltered: testUsedSubestimateIdstoMarkAsFiltered.includes(subestimate.id)
      })),
      timeFrameSubestimates: estimate.timeFrameSubestimates.map((subestimate) => ({
        ...subestimate,
        markedAsFiltered: timeFrameSubestimateIdsToMarkAsFiltered.includes(subestimate.id)
      })),
      sampleTypeSubestimates: estimate.sampleTypeSubestimates.map((subestimate) => ({
        ...subestimate,
        markedAsFiltered: sampleTypeSubestimateIdsToMarkAsFiltered.includes(subestimate.id)
      })),
      animalSourceLocationSubestimates: estimate.animalSourceLocationSubestimates.map((subestimate) => ({
        ...subestimate,
        markedAsFiltered: animalSourceLocationSubestimateIdsToMarkAsFiltered.includes(subestimate.id)
      })),
      animalSamplingContextSubestimates: estimate.animalSamplingContextSubestimates.map((subestimate) => ({
        ...subestimate,
        markedAsFiltered: animalSamplingContextSubestimateIdsToMarkAsFiltered.includes(subestimate.id)
      })),
      occupationSubestimates: estimate.occupationSubestimates.map((subestimate) => ({
        ...subestimate,
        markedAsFiltered: occupationSubestimateIdsToMarkAsFiltered.includes(subestimate.id)
      })),
      camelExposureLevelSubestimates: estimate.camelExposureLevelSubestimates.map((subestimate) => ({
        ...subestimate,
        markedAsFiltered: camelExposureLevelSubestimateIdsToMarkAsFiltered.includes(subestimate.id)
      }))
    }))
    .filter((estimate) => !(
      (estimate.sexSubestimates.length > 0 && estimate.sexSubestimates.every((subestimate) => subestimate.markedAsFiltered)) ||
      (estimate.ageGroupSubestimates.length > 0 && estimate.ageGroupSubestimates.every((subestimate) => subestimate.markedAsFiltered)) ||
      (estimate.animalSpeciesSubestimates.length > 0 && estimate.animalSpeciesSubestimates.every((subestimate) => subestimate.markedAsFiltered)) ||
      (estimate.testUsedSubestimates.length > 0 && estimate.testUsedSubestimates.every((subestimate) => subestimate.markedAsFiltered)) ||
      (estimate.timeFrameSubestimates.length > 0 && estimate.timeFrameSubestimates.every((subestimate) => subestimate.markedAsFiltered)) ||
      (estimate.sampleTypeSubestimates.length > 0 && estimate.sampleTypeSubestimates.every((subestimate) => subestimate.markedAsFiltered)) ||
      (estimate.animalSourceLocationSubestimates.length > 0 && estimate.animalSourceLocationSubestimates.every((subestimate) => subestimate.markedAsFiltered)) ||
      (estimate.animalSamplingContextSubestimates.length > 0 && estimate.animalSamplingContextSubestimates.every((subestimate) => subestimate.markedAsFiltered)) ||
      (estimate.occupationSubestimates.length > 0 && estimate.occupationSubestimates.every((subestimate) => subestimate.markedAsFiltered)) ||
      (estimate.camelExposureLevelSubestimates.length > 0 && estimate.camelExposureLevelSubestimates.every((subestimate) => subestimate.markedAsFiltered))
    ))

  return {
    filteredMersEstimates
  };
}