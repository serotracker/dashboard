import { useState, useCallback, useMemo } from "react";
import { MersVisualizationInformation } from "../visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { WHORegionsTooltip } from "@/components/customs/tooltip-content";
import {
  EstimateBreakdownTable,
  EstimateBreakdownTableFieldOfInterestDropdownOption,
  EstimateBreakdownTableRegionTypeOfInterestDropdownOption,
  EstimateBreakdownTableVariableOfInterestDropdownOption
} from "../../dashboard/(visualizations)/estimate-breakdown-table/estimate-breakdown-table";

export const useEstimateBreakdownTableAndFieldPageConfig = () => {
  const [
    estimateBreakdownTableVariableOfInterest,
    setEstimateBreakdownTableVariableOfInterest,
  ] = useState<EstimateBreakdownTableVariableOfInterestDropdownOption>(
    EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_SEROPREVALENCE
  );

  const [
    estimateBreakdownTableFieldOfInterest,
    setEstimateBreakdownTableFieldOfInterest,
  ] = useState<EstimateBreakdownTableFieldOfInterestDropdownOption>(
    EstimateBreakdownTableFieldOfInterestDropdownOption.AGE_GROUP
  );

  const [
    estimateBreakdownTableRegionTypeOfInterest,
    setEstimateBreakdownTableRegionTypeOfInterest,
  ] = useState<EstimateBreakdownTableRegionTypeOfInterestDropdownOption>(
    EstimateBreakdownTableRegionTypeOfInterestDropdownOption.WHO_REGION
  );

  const getDisplayNameForEstimateBreakdownTableAndField: MersVisualizationInformation<
    string,
    EstimateBreakdownTableVariableOfInterestDropdownOption,
    EstimateBreakdownTableFieldOfInterestDropdownOption,
    EstimateBreakdownTableRegionTypeOfInterestDropdownOption
  >['getDisplayName'] = useCallback(() => ({
    type: VisualizationDisplayNameType.WITH_TRIPLE_DROPDOWN,
    beforeAllDropdownsHeaderText: "",
    firstDropdownProps: {
      dropdownName: 'Variable of Interest Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Seroprevalence Estimates',
        options: [
          EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_SEROPREVALENCE,
          EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_SEROPREVALENCE
        ]
      }, {
        groupHeader: 'Viral Positive Prevalence Estimates',
        options: [
          EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_VIRAL_POSITIVE_PREVALENCE,
          EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_VIRAL_POSITIVE_PREVALENCE
        ]
      }],
      chosenDropdownOption: estimateBreakdownTableVariableOfInterest,
      dropdownOptionToLabelMap: {
        [EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_SEROPREVALENCE]: 'Aggregated Human Seroprevalence',
        [EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_SEROPREVALENCE]: 'Aggregated Animal Seroprevalence',
        [EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_VIRAL_POSITIVE_PREVALENCE]: 'Aggregated Human Viral Positive Prevalence',
        [EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_VIRAL_POSITIVE_PREVALENCE]: 'Aggregated Animal Viral Positive Prevalence',
      },
      onDropdownOptionChange: (option) => {
        setEstimateBreakdownTableVariableOfInterest(option);
      }
    },
    betweenFirstAndSecondDropdownHeaderText: " Grouped By ",
    secondDropdownProps: {
      dropdownName: 'Field of Interest Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Population Sampled',
        options: [
          EstimateBreakdownTableFieldOfInterestDropdownOption.AGE_GROUP,
          EstimateBreakdownTableFieldOfInterestDropdownOption.ANIMAL_SPECIES,
          EstimateBreakdownTableFieldOfInterestDropdownOption.SEX,
        ]
      }],
      chosenDropdownOption: estimateBreakdownTableFieldOfInterest,
      dropdownOptionToLabelMap: {
        [EstimateBreakdownTableFieldOfInterestDropdownOption.AGE_GROUP]: "Age Group",
        [EstimateBreakdownTableFieldOfInterestDropdownOption.ANIMAL_SPECIES]: "Animal Species",
        [EstimateBreakdownTableFieldOfInterestDropdownOption.SEX]: "Sex",
      },
      onDropdownOptionChange: (option) => {
        setEstimateBreakdownTableFieldOfInterest(option);
      }
    },
    betweenSecondAndThirdDropdownHeaderText: " and ",
    thirdDropdownProps: {
      dropdownName: 'Region Type of Interest Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Region Type',
        options: [
          EstimateBreakdownTableRegionTypeOfInterestDropdownOption.WHO_REGION,
          EstimateBreakdownTableRegionTypeOfInterestDropdownOption.UN_REGION,
          EstimateBreakdownTableRegionTypeOfInterestDropdownOption.COUNTRY,
        ]
      }],
      chosenDropdownOption: estimateBreakdownTableRegionTypeOfInterest,
      dropdownOptionToLabelMap: {
        [EstimateBreakdownTableRegionTypeOfInterestDropdownOption.WHO_REGION]: "WHO Region",
        [EstimateBreakdownTableRegionTypeOfInterestDropdownOption.UN_REGION]: "UN Region",
        [EstimateBreakdownTableRegionTypeOfInterestDropdownOption.COUNTRY]: "Country",
      },
      onDropdownOptionChange: (option) => {
        setEstimateBreakdownTableRegionTypeOfInterest(option);
      }
    },
    afterAllDropdownsHeaderText: ""
  }), [
    estimateBreakdownTableVariableOfInterest,
    setEstimateBreakdownTableVariableOfInterest,
    estimateBreakdownTableFieldOfInterest,
    setEstimateBreakdownTableFieldOfInterest,
    estimateBreakdownTableRegionTypeOfInterest,
    setEstimateBreakdownTableRegionTypeOfInterest
  ])

  const estimateBreakdownTableAndFieldTooltipContent: MersVisualizationInformation<
    string,
    EstimateBreakdownTableVariableOfInterestDropdownOption,
    EstimateBreakdownTableFieldOfInterestDropdownOption,
    string
  >['titleTooltipContent'] = useMemo(() => {
    return <WHORegionsTooltip />
  }, []);

  const renderVisualizationForEstimateBreakdownTableAndField: MersVisualizationInformation<
    string,
    EstimateBreakdownTableVariableOfInterestDropdownOption,
    EstimateBreakdownTableFieldOfInterestDropdownOption,
    string
  >['renderVisualization'] = useCallback(({ data }) => (
    <EstimateBreakdownTable
      variableOfInterest={estimateBreakdownTableVariableOfInterest}
      fieldOfInterest={estimateBreakdownTableFieldOfInterest}
      regionTypeOfInterest={estimateBreakdownTableRegionTypeOfInterest}
      data={data}
    />
  ), [ estimateBreakdownTableVariableOfInterest, estimateBreakdownTableFieldOfInterest, estimateBreakdownTableRegionTypeOfInterest ]);

  return {
    getDisplayNameForEstimateBreakdownTableAndField,
    estimateBreakdownTableAndFieldTooltipContent,
    renderVisualizationForEstimateBreakdownTableAndField
  }
}