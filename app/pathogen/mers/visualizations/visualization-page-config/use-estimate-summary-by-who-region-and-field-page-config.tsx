import { useState, useCallback, useMemo } from "react";
import { MersVisualizationInformation } from "../visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { WHORegionsTooltip } from "@/components/customs/tooltip-content";
import { EstimateSummaryByWhoRegion } from "../../dashboard/(visualizations)/estimate-summary-by-who-region/estimate-summary-by-who-region";

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

export const useEstimateSummaryByWhoRegionAndFieldPageConfig = () => {
  const [
    estimateSummaryByWhoRegionVariableOfInterest,
    setEstimateSummaryByWhoRegionVariableOfInterest,
  ] = useState<EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption>(
    EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_HUMAN_SEROPREVALENCE
  );

  const [
    estimateSummaryByWhoRegionFieldOfInterest,
    setEstimateSummaryByWhoRegionFieldOfInterest,
  ] = useState<EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption>(
    EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.AGE_GROUP
  );

  const getDisplayNameForEstimateSummaryByWhoRegionAndField: MersVisualizationInformation<
    string,
    EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption,
    EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption
  >['getDisplayName'] = useCallback(() => ({
    type: VisualizationDisplayNameType.WITH_DOUBLE_DROPDOWN,
    beforeBothDropdownsHeaderText: "",
    firstDropdownProps: {
      dropdownName: 'Variable of Interest Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Seroprevalence Estimates',
        options: [
          EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_HUMAN_SEROPREVALENCE,
          EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_SEROPREVALENCE
        ]
      }, {
        groupHeader: 'Viral Positive Prevalence Estimates',
        options: [
          EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_HUMAN_VIRAL_POSITIVE_PREVALENCE,
          EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_VIRAL_POSITIVE_PREVALENCE
        ]
      }],
      chosenDropdownOption: estimateSummaryByWhoRegionVariableOfInterest,
      dropdownOptionToLabelMap: {
        [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_HUMAN_SEROPREVALENCE]: 'Aggregated Human Seroprevalence',
        [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_SEROPREVALENCE]: 'Aggregated Animal Seroprevalence',
        [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_HUMAN_VIRAL_POSITIVE_PREVALENCE]: 'Aggregated Human Viral Positive Prevalence',
        [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_VIRAL_POSITIVE_PREVALENCE]: 'Aggregated Animal Viral Positive Prevalence',
      },
      onDropdownOptionChange: (option) => {
        setEstimateSummaryByWhoRegionVariableOfInterest(option);
      }
    },
    betweenDropdownsHeaderText: " Grouped By ",
    secondDropdownProps: {
      dropdownName: 'Field of Interest Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Population Sampled',
        options: [
          EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.AGE_GROUP,
          EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.ANIMAL_SPECIES,
          EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.SEX,
        ]
      }],
      chosenDropdownOption: estimateSummaryByWhoRegionFieldOfInterest,
      dropdownOptionToLabelMap: {
        [EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.AGE_GROUP]: "Age Group",
        [EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.ANIMAL_SPECIES]: "Animal Species",
        [EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.SEX]: "Sex",
      },
      onDropdownOptionChange: (option) => {
        setEstimateSummaryByWhoRegionFieldOfInterest(option);
      }
    },
    afterBothDropdownsHeaderText: " and WHO Region"
  }), [ estimateSummaryByWhoRegionVariableOfInterest, setEstimateSummaryByWhoRegionVariableOfInterest, estimateSummaryByWhoRegionFieldOfInterest, setEstimateSummaryByWhoRegionFieldOfInterest ])

  const estimateSummaryByWhoRegionAndFieldTooltipContent: MersVisualizationInformation<
    string,
    EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption,
    EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption
  >['titleTooltipContent'] = useMemo(() => {
    return <WHORegionsTooltip />
  }, []);

  const renderVisualizationForEstimateSummaryByWhoRegionAndField: MersVisualizationInformation<
    string,
    EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption,
    EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption
  >['renderVisualization'] = useCallback(({ data }) => (
    <EstimateSummaryByWhoRegion/>
  ), []);

  return {
    getDisplayNameForEstimateSummaryByWhoRegionAndField,
    estimateSummaryByWhoRegionAndFieldTooltipContent,
    renderVisualizationForEstimateSummaryByWhoRegionAndField
  }
}