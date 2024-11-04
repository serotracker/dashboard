import { Button } from "@/components/ui/button";
import { cn, mixColours, typedGroupBy, typedObjectEntries, typedObjectKeys } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UnRegion, WhoRegion } from "@/gql/graphql";
import uniq from "lodash/uniq";
import { groupDataForRechartsTwice } from "@/components/customs/visualizations/group-data-for-recharts/group-data-for-recharts-twice";
import sum from "lodash/sum";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { useCallback, useContext, useMemo } from "react";
import {
  MersEstimate,
  isAnimalMersEstimate,
  isAnimalMersSeroprevalenceEstimate,
  isAnimalMersViralEstimate,
  isHumanMersAgeGroupSubEstimate,
  isHumanMersEstimate,
  isHumanMersSeroprevalenceEstimate,
  isHumanMersViralEstimate,
} from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { animalSpeciesToStringMap } from "../../(map)/shared-mers-map-pop-up-variables";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { unRegionEnumToLabelMap } from "@/lib/un-regions";

export enum EstimateBreakdownTableVariableOfInterestDropdownOption {
  AGGREGATED_HUMAN_SEROPREVALENCE = "AGGREGATED_HUMAN_SEROPREVALENCE",
  AGGREGATED_ANIMAL_SEROPREVALENCE = "AGGREGATED_ANIMAL_SEROPREVALENCE",
  AGGREGATED_HUMAN_VIRAL_PREVALENCE = "AGGREGATED_HUMAN_VIRAL_PREVALENCE",
  AGGREGATED_ANIMAL_VIRAL_PREVALENCE = "AGGREGATED_ANIMAL_VIRAL_PREVALENCE",
}

export enum EstimateBreakdownTableFieldOfInterestDropdownOption {
  AGE_GROUP = "AGE_GROUP",
  SEX = "SEX",
  ANIMAL_SPECIES = "ANIMAL_SPECIES",
  CAMEL_EXPOSURE_LEVEL = "CAMEL_EXPOSURE_LEVEL",
  ANIMAL_SAMPLE_FRAME = "ANIMAL_SAMPLE_FRAME",
  SPECIMEN_TYPE = "SPECIMEN_TYPE"
}

export enum EstimateBreakdownTableRegionTypeOfInterestDropdownOption {
  WHO_REGION = "WHO_REGION",
  UN_REGION = "UN_REGION",
  COUNTRY = "COUNTRY",
}


export const variableOfInterestToEstimateFilteringFunction: Record<EstimateBreakdownTableVariableOfInterestDropdownOption, (estimate: MersEstimate) => boolean> = {
  [EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_SEROPREVALENCE]: (estimate) => isHumanMersSeroprevalenceEstimate(estimate),
  [EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_SEROPREVALENCE]: (estimate) => isAnimalMersSeroprevalenceEstimate(estimate),
  [EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_VIRAL_PREVALENCE]: (estimate) => isHumanMersViralEstimate(estimate),
  [EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_VIRAL_PREVALENCE]: (estimate) => isAnimalMersViralEstimate(estimate),
} 


type FieldOfInterestExtractingFunctionResult = Array<{
  whoRegion: WhoRegion;
  unRegion: UnRegion;
  countryAlphaTwoCode: string;
  sampleNumerator: number;
  sampleDenominator: number;
  group: string;
}>;

export const fieldOfInterestToFieldOfInterestExtractingFunction: Record<EstimateBreakdownTableFieldOfInterestDropdownOption, (estimate: MersEstimate) => FieldOfInterestExtractingFunctionResult> = {
  [EstimateBreakdownTableFieldOfInterestDropdownOption.SEX]: (estimate) => {
    const { whoRegion, unRegion, countryAlphaTwoCode, sex, sampleDenominator, sampleNumerator } = estimate.primaryEstimateInfo;

    if(!whoRegion || !unRegion) {
      return [];
    }

    if(estimate.sexSubestimates.length === 0) {
      if(
        sampleNumerator === undefined ||
        sampleNumerator === null ||
        sampleDenominator === undefined ||
        sampleDenominator === null
      ) {
        return [];
      }

      return sex ? [{
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        sampleDenominator,
        sampleNumerator,
        group: sex
      }] : []
    }

    return estimate.sexSubestimates.map((subestimate) => {
      if(subestimate.markedAsFiltered === true) {
        return undefined;
      }

      const subestimateSampleNumerator = subestimate.estimateInfo.sampleNumerator;
      const subestimateSampleDenominator = subestimate.estimateInfo.sampleDenominator;

      if(
        subestimateSampleNumerator === undefined ||
        subestimateSampleNumerator === null ||
        subestimateSampleDenominator === undefined ||
        subestimateSampleDenominator === null
      ) {
        return undefined;
      }

      return {
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        group: subestimate.sex,
        sampleNumerator: subestimateSampleNumerator,
        sampleDenominator: subestimateSampleDenominator
      }
    }).filter((element): element is NonNullable<typeof element> => !!element);
  },
  [EstimateBreakdownTableFieldOfInterestDropdownOption.AGE_GROUP]: (estimate) => {
    const { whoRegion, unRegion, countryAlphaTwoCode, sampleDenominator, sampleNumerator } = estimate.primaryEstimateInfo;
    const ageGroups = isAnimalMersEstimate(estimate)
      ? estimate.primaryEstimateInfo.animalAgeGroup
      : estimate.primaryEstimateInfo.ageGroup

    if(!whoRegion || !unRegion) {
      return [];
    }

    if(estimate.ageGroupSubestimates.length === 0) {
      if(
        sampleNumerator === undefined ||
        sampleNumerator === null ||
        sampleDenominator === undefined ||
        sampleDenominator === null
      ) {
        return [];
      }

      const numeratorRemainder = sampleNumerator % ageGroups.length
      const denominatorRemainder = sampleDenominator % ageGroups.length

      return ageGroups.map((ageGroup, index) => ({
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        sampleDenominator: denominatorRemainder > index  
          ? Math.max(Math.floor(sampleDenominator / ageGroups.length) + 1, 1)
          : Math.max(Math.floor(sampleDenominator / ageGroups.length), 1),
        sampleNumerator: numeratorRemainder > index 
          ? Math.floor(sampleNumerator / ageGroups.length) + 1
          : Math.floor(sampleNumerator / ageGroups.length),
        group: ageGroup
      }));
    }

    return estimate.ageGroupSubestimates.flatMap((subestimate) => {
      if(subestimate.markedAsFiltered === true) {
        return undefined;
      }

      const subestimateSampleNumerator = subestimate.estimateInfo.sampleNumerator;
      const subestimateSampleDenominator = subestimate.estimateInfo.sampleDenominator;

      if(
        subestimateSampleNumerator === undefined ||
        subestimateSampleNumerator === null ||
        subestimateSampleDenominator === undefined ||
        subestimateSampleDenominator === null
      ) {
        return undefined;
      }
      
      const ageGroups = isHumanMersAgeGroupSubEstimate(subestimate)
        ? subestimate.ageGroup
        : subestimate.animalAgeGroup;

      const numeratorRemainder = subestimateSampleNumerator % ageGroups.length
      const denominatorRemainder = subestimateSampleDenominator % ageGroups.length

      return ageGroups.map((ageGroup, index) => ({
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        sampleDenominator: denominatorRemainder > index
          ? Math.max(Math.floor(subestimateSampleDenominator / ageGroups.length) + 1, 1)
          : Math.max(Math.floor(subestimateSampleDenominator / ageGroups.length), 1),
        sampleNumerator: numeratorRemainder > index
          ? Math.floor(subestimateSampleNumerator / ageGroups.length) + 1
          : Math.floor(subestimateSampleNumerator / ageGroups.length),
        group: ageGroup
      }));
    }).filter((element): element is NonNullable<typeof element> => !!element);
  },
  [EstimateBreakdownTableFieldOfInterestDropdownOption.CAMEL_EXPOSURE_LEVEL]: (estimate) => {
    const { whoRegion, unRegion, countryAlphaTwoCode, sampleDenominator, sampleNumerator } = estimate.primaryEstimateInfo;

    if(!whoRegion || !unRegion) {
      return [];
    }

    if(!isHumanMersEstimate(estimate)) {
      return [];
    }

    const { exposureToCamels } = estimate.primaryEstimateInfo;

    if(!exposureToCamels) {
      if(
        sampleNumerator === undefined ||
        sampleNumerator === null ||
        sampleDenominator === undefined ||
        sampleDenominator === null
      ) {
        return [];
      }

      return [{
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        sampleDenominator,
        sampleNumerator,
        group: 'Not reported'
      }];
    }

    if(estimate.occupationSubestimates.length === 0 && estimate.occupationSubestimates.length === 0) {
      if(
        sampleNumerator === undefined ||
        sampleNumerator === null ||
        sampleDenominator === undefined ||
        sampleDenominator === null
      ) {
        return [];
      }

      return exposureToCamels ? [{
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        sampleDenominator,
        sampleNumerator,
        group: exposureToCamels
      }] : []
    }

    const subestimatesToMap = [
      ...estimate.occupationSubestimates,
      ...estimate.camelExposureLevelSubestimates
    ]

    return subestimatesToMap.map((subestimate) => {
      if(subestimate.markedAsFiltered === true) {
        return undefined;
      }

      const subestimateSampleNumerator = subestimate.estimateInfo.sampleNumerator;
      const subestimateSampleDenominator = subestimate.estimateInfo.sampleDenominator;

      if(
        subestimateSampleNumerator === undefined ||
        subestimateSampleNumerator === null ||
        subestimateSampleDenominator === undefined ||
        subestimateSampleDenominator === null
      ) {
        return undefined;
      }

      const { exposureToCamels } = subestimate;

      if(!exposureToCamels) {
        return {
          whoRegion,
          unRegion,
          countryAlphaTwoCode,
          sampleNumerator: subestimateSampleNumerator,
          sampleDenominator: subestimateSampleDenominator,
          group: 'Not reported'
        };
      }

      return {
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        group: exposureToCamels,
        sampleNumerator: subestimateSampleNumerator,
        sampleDenominator: subestimateSampleDenominator
      }
    }).filter((element): element is NonNullable<typeof element> => !!element);
  },
  [EstimateBreakdownTableFieldOfInterestDropdownOption.ANIMAL_SPECIES]: (estimate) => {
    const { whoRegion, unRegion, countryAlphaTwoCode, sampleDenominator, sampleNumerator } = estimate.primaryEstimateInfo;

    if(!whoRegion || !unRegion) {
      return [];
    }

    if(!isAnimalMersEstimate(estimate)) {
      return [];
    }

    const { animalSpecies } = estimate.primaryEstimateInfo;

    if(estimate.animalSpeciesSubestimates.length === 0) {
      if(
        sampleNumerator === undefined ||
        sampleNumerator === null ||
        sampleDenominator === undefined ||
        sampleDenominator === null
      ) {
        return [];
      }

      return animalSpecies ? [{
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        sampleDenominator,
        sampleNumerator,
        group: animalSpeciesToStringMap[animalSpecies]
      }] : []
    }

    return estimate.animalSpeciesSubestimates.map((subestimate) => {
      if(subestimate.markedAsFiltered === true) {
        return undefined;
      }

      const subestimateSampleNumerator = subestimate.estimateInfo.sampleNumerator;
      const subestimateSampleDenominator = subestimate.estimateInfo.sampleDenominator;

      if(
        subestimateSampleNumerator === undefined ||
        subestimateSampleNumerator === null ||
        subestimateSampleDenominator === undefined ||
        subestimateSampleDenominator === null
      ) {
        return undefined;
      }

      return {
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        group: animalSpeciesToStringMap[subestimate.animalSpecies],
        sampleNumerator: subestimateSampleNumerator,
        sampleDenominator: subestimateSampleDenominator
      }
    }).filter((element): element is NonNullable<typeof element> => !!element);
  },
  [EstimateBreakdownTableFieldOfInterestDropdownOption.SPECIMEN_TYPE]: (estimate) => {
    const { whoRegion, unRegion, countryAlphaTwoCode, specimenType, sampleDenominator, sampleNumerator } = estimate.primaryEstimateInfo;

    if(!whoRegion || !unRegion) {
      return [];
    }

    if(estimate.sampleTypeSubestimates.length === 0) {
      if(
        sampleNumerator === undefined ||
        sampleNumerator === null ||
        sampleDenominator === undefined ||
        sampleDenominator === null
      ) {
        return [];
      }

      return specimenType ? [{
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        sampleDenominator,
        sampleNumerator,
        group: specimenType.join(',')
      }] : []
    }

    return estimate.sampleTypeSubestimates.map((subestimate) => {
      if(subestimate.markedAsFiltered === true) {
        return undefined;
      }

      const subestimateSampleNumerator = subestimate.estimateInfo.sampleNumerator;
      const subestimateSampleDenominator = subestimate.estimateInfo.sampleDenominator;

      if(
        subestimateSampleNumerator === undefined ||
        subestimateSampleNumerator === null ||
        subestimateSampleDenominator === undefined ||
        subestimateSampleDenominator === null
      ) {
        return undefined;
      }

      return {
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        group: subestimate.specimenType.join(','),
        sampleNumerator: subestimateSampleNumerator,
        sampleDenominator: subestimateSampleDenominator
      }
    }).filter((element): element is NonNullable<typeof element> => !!element);
  },
  [EstimateBreakdownTableFieldOfInterestDropdownOption.ANIMAL_SAMPLE_FRAME]: (estimate) => {
    const { whoRegion, unRegion, sampleNumerator, countryAlphaTwoCode, sampleDenominator } = estimate.primaryEstimateInfo;

    if(!whoRegion || !unRegion) {
      return [];
    }

    if(!isAnimalMersEstimate(estimate)) {
      return [];
    }

    const { animalDetectionSettings } = estimate.primaryEstimateInfo;

    if(estimate.animalSamplingContextSubestimates.length === 0) {
      if(
        sampleNumerator === undefined ||
        sampleNumerator === null ||
        sampleDenominator === undefined ||
        sampleDenominator === null
      ) {
        return [];
      }

      const numeratorRemainder = sampleNumerator % animalDetectionSettings.length
      const denominatorRemainder = sampleDenominator % animalDetectionSettings.length

      return animalDetectionSettings.map((animalSampleFrame, index) => ({
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        sampleDenominator: denominatorRemainder > index
          ? Math.max(Math.floor(sampleDenominator / animalDetectionSettings.length) + 1, 1)
          : Math.max(Math.floor(sampleDenominator / animalDetectionSettings.length), 1),
        sampleNumerator: numeratorRemainder > index
          ? Math.floor(sampleNumerator / animalDetectionSettings.length) + 1
          : Math.floor(sampleNumerator / animalDetectionSettings.length),
        group: animalSampleFrame
      }));
    }

    return estimate.animalSamplingContextSubestimates.flatMap((subestimate) => {
      if(subestimate.markedAsFiltered === true) {
        return undefined;
      }

      const subestimateSampleNumerator = subestimate.estimateInfo.sampleNumerator;
      const subestimateSampleDenominator = subestimate.estimateInfo.sampleDenominator;

      if(
        subestimateSampleNumerator === undefined ||
        subestimateSampleNumerator === null ||
        subestimateSampleDenominator === undefined ||
        subestimateSampleDenominator === null
      ) {
        return undefined;
      }

      const numeratorRemainder = subestimateSampleNumerator % subestimate.animalDetectionSettings.length;
      const denominatorRemainder = subestimateSampleDenominator % subestimate.animalDetectionSettings.length;
      
      return subestimate.animalDetectionSettings.map((animalSampleFrame, index) => ({
        whoRegion,
        unRegion,
        countryAlphaTwoCode,
        sampleDenominator: denominatorRemainder > index
          ? Math.max(Math.floor(subestimateSampleDenominator / subestimate.animalDetectionSettings.length) + 1, 1)
          : Math.max(Math.floor(subestimateSampleDenominator / subestimate.animalDetectionSettings.length), 1),
        sampleNumerator: numeratorRemainder > index
          ? Math.floor(subestimateSampleNumerator / subestimate.animalDetectionSettings.length) + 1
          : Math.floor(subestimateSampleNumerator / subestimate.animalDetectionSettings.length),
        group: animalSampleFrame
      }));
    }).filter((element): element is NonNullable<typeof element> => !!element);
  },
}

export const regionOfInterestToRegionOfInterestExtractingFunction: Record<EstimateBreakdownTableRegionTypeOfInterestDropdownOption, (
  dataPoint: {
    whoRegion: WhoRegion;
    unRegion: UnRegion;
    countryAlphaTwoCode: string;
  },
  countryAlphaTwoCodeToCountryNameMap: Record<string, string | undefined>
) => string> = {
  [EstimateBreakdownTableRegionTypeOfInterestDropdownOption.WHO_REGION]: (dataPoint) => dataPoint.whoRegion,
  [EstimateBreakdownTableRegionTypeOfInterestDropdownOption.UN_REGION]: (dataPoint) => unRegionEnumToLabelMap[dataPoint.unRegion],
  [EstimateBreakdownTableRegionTypeOfInterestDropdownOption.COUNTRY]: (dataPoint, countryAlphaTwoCodeToCountryNameMap) => countryAlphaTwoCodeToCountryNameMap[dataPoint.countryAlphaTwoCode] ?? 'Unknown',
}

interface EstimateBreakdownTableProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  variableOfInterest: EstimateBreakdownTableVariableOfInterestDropdownOption;
  fieldOfInterest: EstimateBreakdownTableFieldOfInterestDropdownOption;
  regionTypeOfInterest: EstimateBreakdownTableRegionTypeOfInterestDropdownOption;
}

const zeroValuedColourHexCode = "#f9f1f0";
const oneValuedColourHexCode = "#f79489";

export const EstimateBreakdownTable = (props: EstimateBreakdownTableProps) => {
  const { data, variableOfInterest, fieldOfInterest, regionTypeOfInterest } = props;
  const { countryAlphaTwoCodeToCountryNameMap } = useContext(CountryInformationContext)

  const brokenDownEstimates = useMemo(() => data
    .filter((dataPoint): dataPoint is MersEstimate => 'primaryEstimateInfo' in dataPoint)
    .filter((estimate) => variableOfInterestToEstimateFilteringFunction[variableOfInterest](estimate))
    .flatMap((estimate) => fieldOfInterestToFieldOfInterestExtractingFunction[fieldOfInterest](estimate))
    .map((estimate) => ({ ...estimate, region: regionOfInterestToRegionOfInterestExtractingFunction[regionTypeOfInterest](
      estimate,
      countryAlphaTwoCodeToCountryNameMap
    )}))
  , [ data, variableOfInterest, fieldOfInterest, countryAlphaTwoCodeToCountryNameMap, regionTypeOfInterest ]);

  const validGroups = useMemo(() => uniq(['Overall', ...(brokenDownEstimates.map((estimate) => estimate.group))
    .filter((group): group is NonNullable<typeof group> => !!group)
    .sort()
  ]), [ brokenDownEstimates ]);

  const validRegions = useMemo(() => uniq(
    brokenDownEstimates.map((estimate) => estimate.region)).sort()
  , [ brokenDownEstimates ]);

  const {
    rechartsData: groupedBrokenDownEstimates,
  } = groupDataForRechartsTwice({
    data: brokenDownEstimates,
    primaryGroupingFunction: (data) => data.region,
    secondaryGroupingFunction: (data) => uniq([ data.group, 'Overall' ]),
    transformOutputValue: ({ data }) => {
      const totalNumerator = sum(data.map((subestimate) => subestimate.sampleNumerator));
      const totalDenominator = sum(data.map((subestimate) => subestimate.sampleDenominator));
      const seroprevalencePercentageString = (totalDenominator !== 0)
        ? `${((totalNumerator / totalDenominator) * 100).toFixed(3)}%`
        : 'N/A'
      const backgroundColourHexCode = (totalDenominator !== 0)
        ? mixColours({
          zeroValuedColourHexCode,
          oneValuedColourHexCode,
          value: (totalNumerator / totalDenominator)
        })
        : "#ffffff";
      
      return {
        seroprevalencePercentageString,
        backgroundColourHexCode
      }
    }
  })

  const downloadCsv = useCallback(() => {
    const dataForCsv = validRegions.flatMap((region) => {
      const dataForRegion = groupedBrokenDownEstimates.find((estimate) => estimate.primaryKey === region);

      if(!dataForRegion) {
        return [];
      }

      const { primaryKey, ...dataWithoutPrimaryKey } = dataForRegion;

      return typedObjectEntries(dataWithoutPrimaryKey)
        .filter(([key, value]) => value.seroprevalencePercentageString !== 'N/A')
        .map(([key, value]) => ({
          ...(regionTypeOfInterest === EstimateBreakdownTableRegionTypeOfInterestDropdownOption.WHO_REGION ? {
            whoRegion: region
          } : {}),
          ...(regionTypeOfInterest === EstimateBreakdownTableRegionTypeOfInterestDropdownOption.UN_REGION ? {
            unRegion: region
          } : {}),
          ...(regionTypeOfInterest === EstimateBreakdownTableRegionTypeOfInterestDropdownOption.COUNTRY ? {
            country: region
          } : {}),
          ...((
            variableOfInterest === EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_SEROPREVALENCE
            || variableOfInterest === EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_SEROPREVALENCE
          ) ? {
            seroprevalence: value.seroprevalencePercentageString,
          } : {}),
          ...((
            variableOfInterest === EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_VIRAL_PREVALENCE
            || variableOfInterest === EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_VIRAL_PREVALENCE
          ) ? {
            viralPositivePrevalence: value.seroprevalencePercentageString,
          } : {}),
          ...(fieldOfInterest === EstimateBreakdownTableFieldOfInterestDropdownOption.AGE_GROUP ? {
            ageGroup: key,
          } : {}),
          ...(fieldOfInterest === EstimateBreakdownTableFieldOfInterestDropdownOption.ANIMAL_SPECIES ? {
            animalSpecies: key,
          } : {}),
          ...(fieldOfInterest === EstimateBreakdownTableFieldOfInterestDropdownOption.SEX ? {
            sex: key,
          } : {}),
          ...(fieldOfInterest === EstimateBreakdownTableFieldOfInterestDropdownOption.SPECIMEN_TYPE ? {
            specimenType: key,
          } : {}),
          ...(fieldOfInterest === EstimateBreakdownTableFieldOfInterestDropdownOption.ANIMAL_SAMPLE_FRAME ? {
            animalSampleFrame: key,
          } : {}),
          ...(fieldOfInterest === EstimateBreakdownTableFieldOfInterestDropdownOption.CAMEL_EXPOSURE_LEVEL ? {
            exposureToCamels: key,
          } : {}),
        }))
    });

    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: "estimate-breakdown",
    });
    const csv = generateCsv(csvConfig)(dataForCsv);
    download(csvConfig)(csv);
  }, [ variableOfInterest, regionTypeOfInterest, groupedBrokenDownEstimates, fieldOfInterest, validRegions ]);


  if(validRegions.length === 0) {
    return (
      <div className="p-2 w-full">
       <p> No data available.</p>
      </div>
    )
  }

  return (
    <div className="p-2">
      <div className="flex justify-between mb-2">
        <div className="grow flex justify-center"> 
          <p className="hidden lg:flex items-center"> Seroprevalence: </p>
          {[0, 0.25, 0.5, 0.75, 1].map((value) => (
            <div className="items-center inline-flex mx-2 my-1" key={value}>
              <div
                className={`w-[1em] h-[1em] border-2 border-gray-500 mr-2`}
                style={{ backgroundColor: mixColours({
                  zeroValuedColourHexCode,
                  oneValuedColourHexCode,
                  value
                })}}
              ></div>
              <p>{`${(value * 100).toFixed(0)}%`}</p>
            </div>
          ))}
        </div>
        <div className="space-x-2 justify-between ignore-for-visualization-download">
          <Button
            variant="outline"
            size="sm"
            className={cn("text-white", validGroups.length === 0 ? 'hidden' : '')}
            onClick={() => downloadCsv()}
          >
            Download CSV
          </Button>
        </div>
      </div>
      <Table className="border-separate border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead className="border-l border-b border-t bg-white whitespace-nowrap" />
            {validGroups.map((group) => (
              <TableHead
                className="border bg-white whitespace-nowrap"
                key={`estimate-breakdown-table-${group}-header`}
              >
                {group}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {validRegions
            .sort()
            .map((region) => (
            <TableRow
              key={`estimate-breakdown-table-${region}-row`}
            >
              <TableCell className="border-l border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap">
                {region}
              </TableCell>
              {validGroups.map((group) => {
                const dataForRow = groupedBrokenDownEstimates
                  .find(({primaryKey}) => primaryKey === region);

                const dataForCell = dataForRow && dataForRow[group]
                  ? dataForRow[group]
                  : { seroprevalencePercentageString: 'N/A', backgroundColourHexCode: "#FFFFFF"}

                return (
                  <TableCell
                    className="border-l border-r border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap"
                    key={`estimate-breakdown-table-${region}-${group}-cell`}
                    style={{ backgroundColor: dataForCell.backgroundColourHexCode }}
                  >
                    {dataForCell.seroprevalencePercentageString}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}