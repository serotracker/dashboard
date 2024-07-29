import { Button } from "@/components/ui/button";
import { cn, mixColours, typedGroupBy, typedObjectKeys } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WhoRegion } from "@/gql/graphql";
import uniq from "lodash/uniq";
import { groupDataForRechartsTwice } from "@/components/customs/visualizations/group-data-for-recharts/group-data-for-recharts-twice";
import sum from "lodash/sum";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { useMemo } from "react";
import {
  MersEstimate,
  isAnimalMersEstimate,
  isAnimalMersSeroprevalenceEstimate,
  isAnimalMersViralEstimate,
  isHumanMersAgeGroupSubEstimate,
  isHumanMersSeroprevalenceEstimate,
  isHumanMersViralEstimate,
} from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { animalSpeciesToStringMap } from "../../(map)/shared-mers-map-pop-up-variables";

export enum EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption {
  AGGREGATED_HUMAN_SEROPREVALENCE = "AGGREGATED_HUMAN_SEROPREVALENCE",
  AGGREGATED_ANIMAL_SEROPREVALENCE = "AGGREGATED_ANIMAL_SEROPREVALENCE",
  AGGREGATED_HUMAN_VIRAL_POSITIVE_PREVALENCE = "AGGREGATED_HUMAN_VIRAL_POSITIVE_PREVALENCE",
  AGGREGATED_ANIMAL_VIRAL_POSITIVE_PREVALENCE = "AGGREGATED_ANIMAL_VIRAL_POSITIVE_PREVALENCE",
}

export enum EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption {
  AGE_GROUP = "AGE_GROUP",
  SEX = "SEX",
  ANIMAL_SPECIES = "ANIMAL_SPECIES"
}


export const variableOfInterestToEstimateFilteringFunction: Record<EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption, (estimate: MersEstimate) => boolean> = {
  [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_HUMAN_SEROPREVALENCE]: (estimate) => isHumanMersSeroprevalenceEstimate(estimate),
  [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_SEROPREVALENCE]: (estimate) => isAnimalMersSeroprevalenceEstimate(estimate),
  [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_HUMAN_VIRAL_POSITIVE_PREVALENCE]: (estimate) => isHumanMersViralEstimate(estimate),
  [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_VIRAL_POSITIVE_PREVALENCE]: (estimate) => isAnimalMersViralEstimate(estimate),
} 


type FieldOfInterestExtractingFunctionResult = Array<{
  whoRegion: WhoRegion;
  sampleNumerator: number;
  sampleDenominator: number;
  group: string;
}>;

export const fieldOfInterestToFieldOfInterestExtractingFunction: Record<EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption, (estimate: MersEstimate) => FieldOfInterestExtractingFunctionResult> = {
  [EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.SEX]: (estimate) => {
    const { whoRegion, sex, sampleDenominator, sampleNumerator } = estimate.primaryEstimateInfo;

    if(!whoRegion) {
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
        whoRegion: whoRegion,
        sampleDenominator,
        sampleNumerator,
        group: sex
      }] : []
    }

    return estimate.sexSubestimates.map((subestimate) => {
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
        group: subestimate.sex,
        sampleNumerator: subestimateSampleNumerator,
        sampleDenominator: subestimateSampleDenominator
      }
    }).filter((element): element is NonNullable<typeof element> => !!element);
  },
  [EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.AGE_GROUP]: (estimate) => {
    const { whoRegion, sampleDenominator, sampleNumerator } = estimate.primaryEstimateInfo;
    const ageGroups = isAnimalMersEstimate(estimate)
      ? estimate.primaryEstimateInfo.animalAgeGroup
      : estimate.primaryEstimateInfo.ageGroup

    if(!whoRegion) {
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

      return ageGroups.map((ageGroup) => ({
        whoRegion: whoRegion,
        sampleDenominator: Math.floor(sampleDenominator / ageGroups.length),
        sampleNumerator: Math.floor(sampleNumerator / ageGroups.length),
        group: ageGroup
      }));
    }

    return estimate.ageGroupSubestimates.flatMap((subestimate) => {
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

      return ageGroups.map((ageGroup) => ({
        whoRegion: whoRegion,
        sampleDenominator: Math.floor(subestimateSampleDenominator / ageGroups.length),
        sampleNumerator: Math.floor(subestimateSampleNumerator / ageGroups.length),
        group: ageGroup
      }));
    }).filter((element): element is NonNullable<typeof element> => !!element);
  },
  [EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.ANIMAL_SPECIES]: (estimate) => {
    const { whoRegion, sampleDenominator, sampleNumerator } = estimate.primaryEstimateInfo;

    if(!whoRegion) {
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
        whoRegion: whoRegion,
        sampleDenominator,
        sampleNumerator,
        group: animalSpeciesToStringMap[animalSpecies]
      }] : []
    }

    return estimate.animalSpeciesSubestimates.map((subestimate) => {
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
        group: animalSpeciesToStringMap[subestimate.animalSpecies],
        sampleNumerator: subestimateSampleNumerator,
        sampleDenominator: subestimateSampleDenominator
      }
    }).filter((element): element is NonNullable<typeof element> => !!element);
  }
}

interface EstimateSummaryByWhoRegionProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  variableOfInterest: EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption;
  fieldOfInterest: EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption;
}

export const EstimateSummaryByWhoRegion = (props: EstimateSummaryByWhoRegionProps) => {
  const { data, variableOfInterest, fieldOfInterest } = props;

  const zeroValuedColourHexCode = "#f9f1f0";
  const oneValuedColourHexCode = "#f79489";

  const brokenDownEstimates = useMemo(() => data
    .filter((dataPoint): dataPoint is MersEstimate => 'primaryEstimateInfo' in dataPoint)
    .filter((estimate) => variableOfInterestToEstimateFilteringFunction[variableOfInterest](estimate))
    .flatMap((estimate) => fieldOfInterestToFieldOfInterestExtractingFunction[fieldOfInterest](estimate))
  , [ data, variableOfInterest, fieldOfInterest ]);

  const validGroups = uniq(['All', ...(brokenDownEstimates.map((estimate) => estimate.group))
    .filter((group): group is NonNullable<typeof group> => !!group)
    .sort()
  ]);

  const validWhoRegions = uniq(brokenDownEstimates.map((estimate) => estimate.whoRegion))
    .filter((whoRegion): whoRegion is NonNullable<typeof whoRegion> => !!whoRegion)
    .sort();

  const {
    rechartsData: groupedBrokenDownEstimates,
  } = groupDataForRechartsTwice({
    data: brokenDownEstimates,
    primaryGroupingFunction: (data) => data.whoRegion,
    secondaryGroupingFunction: (data) => data.group,
    transformOutputValue: (data) => data
  })

  if(validWhoRegions.length === 0) {
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
            onClick={() => {}}
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
                key={`estimate-summary-by-who-region-table-${group}-header`}
              >
                {group}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {validWhoRegions
            .sort()
            .map((whoRegion) => (
            <TableRow
              key={`estimate-summary-by-who-region-table-${whoRegion}-row`}
            >
              <TableCell className="border-l border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap">
                {whoRegion}
              </TableCell>
              {validGroups.map((group) => {
                const dataForRow = groupedBrokenDownEstimates
                  .find(({primaryKey}) => primaryKey === whoRegion);
                const dataForCell = dataForRow
                  ? group === 'All'
                    ? validGroups.flatMap((group) => dataForRow[group]?.data ?? [])
                    : (dataForRow[group]?.data ?? [])
                  : [];

                const totalNumerator = sum(dataForCell.map((subestimate) => subestimate.sampleNumerator));
                const totalDenominator = sum(dataForCell.map((subestimate) => subestimate.sampleDenominator));
                const seroprevalencePercentageString = (totalDenominator !== 0)
                  ? `${((totalNumerator / totalDenominator) * 100).toFixed(1)}%`
                  : 'N/A'
                const backgroundColourHexCode = (totalDenominator !== 0)
                  ? mixColours({
                      zeroValuedColourHexCode,
                      oneValuedColourHexCode,
                      value: (totalNumerator / totalDenominator)
                    })
                  : "#ffffff";

                return (
                  <TableCell
                    className="border-l border-r border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap"
                    key={`estimate-summary-by-who-region-table-${whoRegion}-${group}-cell`}
                    style={{ backgroundColor: backgroundColourHexCode }}
                  >
                    {seroprevalencePercentageString}
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