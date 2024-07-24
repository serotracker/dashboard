import { useState, useCallback, useMemo } from "react";
import { MersVisualizationInformation } from "../visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { WHORegionsTooltip } from "@/components/customs/tooltip-content";

export enum EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption {
  MEDIAN_HUMAN_SEROPREVALENCE = "MEDIAN_HUMAN_SEROPREVALENCE",
  HUMAN_SEROPREVALENCE_ESTIMATE_COUNT = "HUMAN_SEROPREVALENCE_ESTIMATE_COUNT",
  MEDIAN_ANIMAL_SEROPREVALENCE = "MEDIAN_ANIMAL_SEROPREVALENCE",
  ANIMAL_SEROPREVALENCE_ESTIMATE_COUNT = "ANIMAL_SEROPREVALENCE_ESTIMATE_COUNT",
  MEDIAN_HUMAN_VIRAL_PREVALENCE = "MEDIAN_HUMAN_VIRAL_PREVALENCE",
  HUMAN_VIRAL_PREVALENCE_ESTIMATE_COUNT = "HUMAN_VIRAL_PREVALENCE_ESTIMATE_COUNT",
  MEDIAN_ANIMAL_VIRAL_PREVALENCE = "MEDIAN_ANIMAL_VIRAL_PREVALENCE",
  ANIMAL_VIRAL_PREVALENCE_ESTIMATE_COUNT = "ANIMAL_VIRAL_PREVALENCE_ESTIMATE_COUNT",
}

export enum EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption {
  AGE_GROUP = "AGE_GROUP",
  SAMPLE_FRAME = "SAMPLE_FRAME",
  SOURCE_TYPE = "SOURCE_TYPE",
  ASSAY = "ASSAY",
  ISOTYPES = "ISOTYPES",
  TEST_PRODUCER = "TEST_PRODUCER",
}

export const useEstimateSummaryByWhoRegionAndFieldPageConfig = () => {
  const [
    estimateSummaryByWhoRegionVariableOfInterest,
    setEstimateSummaryByWhoRegionVariableOfInterest,
  ] = useState<EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption>(
    EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.MEDIAN_HUMAN_SEROPREVALENCE
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
          EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.MEDIAN_HUMAN_SEROPREVALENCE,
          EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE_ESTIMATE_COUNT,
          EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.MEDIAN_ANIMAL_SEROPREVALENCE,
          EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE_ESTIMATE_COUNT
        ]
      }, {
        groupHeader: 'Viral Positive Prevalence Estimates',
        options: [
          EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.MEDIAN_HUMAN_VIRAL_PREVALENCE,
          EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.HUMAN_VIRAL_PREVALENCE_ESTIMATE_COUNT,
          EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.MEDIAN_ANIMAL_VIRAL_PREVALENCE,
          EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.ANIMAL_VIRAL_PREVALENCE_ESTIMATE_COUNT
        ]
      }],
      chosenDropdownOption: estimateSummaryByWhoRegionVariableOfInterest,
      dropdownOptionToLabelMap: {
        [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.MEDIAN_HUMAN_SEROPREVALENCE]: '',
        [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE_ESTIMATE_COUNT]: '',
        [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.MEDIAN_ANIMAL_SEROPREVALENCE]: '',
        [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE_ESTIMATE_COUNT]: '',
        [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.MEDIAN_HUMAN_VIRAL_PREVALENCE]: '',
        [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.HUMAN_VIRAL_PREVALENCE_ESTIMATE_COUNT]: '',
        [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.MEDIAN_ANIMAL_VIRAL_PREVALENCE]: '',
        [EstimateSummaryByWhoRegionAndFieldVariableOfInterestDropdownOption.ANIMAL_VIRAL_PREVALENCE_ESTIMATE_COUNT]: '',
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
        groupHeader: 'Study Information',
        options: [
          EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.SOURCE_TYPE,
        ]
      }, {
        groupHeader: 'Population Sampled',
        options: [
          EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.SAMPLE_FRAME,
          EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.AGE_GROUP,
        ]
      }, {
        groupHeader: 'Test Parameters',
        options: [
          EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.ASSAY,
          EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.ISOTYPES,
          EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.TEST_PRODUCER,
        ]
      }],
      chosenDropdownOption: estimateSummaryByWhoRegionFieldOfInterest,
      dropdownOptionToLabelMap: {
        [EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.SOURCE_TYPE]: "Source Type",
        [EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.SAMPLE_FRAME]: "Sample Frame",
        [EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.AGE_GROUP]: "Age Group",
        [EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.ASSAY]: "Assay",
        [EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.ISOTYPES]: "Isotype",
        [EstimateSummaryByWhoRegionAndFieldFieldOfInterestDropdownOption.TEST_PRODUCER]: "Test Producer",
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
    <div> ABC </div>
  ), []);

  return {
    getDisplayNameForEstimateSummaryByWhoRegionAndField,
    estimateSummaryByWhoRegionAndFieldTooltipContent,
    renderVisualizationForEstimateSummaryByWhoRegionAndField
  }
}