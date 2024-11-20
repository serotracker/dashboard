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
    _estimateBreakdownTableFieldOfInterest,
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

  const fieldOfInterestDropdownOptionGroups = useMemo(() => [{
    groupHeader: 'Population Sampled',
    options: [
      EstimateBreakdownTableFieldOfInterestDropdownOption.AGE_GROUP,
      ...((
        estimateBreakdownTableVariableOfInterest === EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_SEROPREVALENCE ||
        estimateBreakdownTableVariableOfInterest === EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_VIRAL_PREVALENCE
      )
        ? [EstimateBreakdownTableFieldOfInterestDropdownOption.ANIMAL_SPECIES, EstimateBreakdownTableFieldOfInterestDropdownOption.ANIMAL_SAMPLE_FRAME ]
        : []
      ),
      ...((
        estimateBreakdownTableVariableOfInterest === EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_SEROPREVALENCE ||
        estimateBreakdownTableVariableOfInterest === EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_VIRAL_PREVALENCE
      )
        ? [EstimateBreakdownTableFieldOfInterestDropdownOption.CAMEL_EXPOSURE_LEVEL ]
        : []
      ),
      EstimateBreakdownTableFieldOfInterestDropdownOption.SEX,
    ]
  }, {
    groupHeader: 'Test Parameters',
    options: [
      EstimateBreakdownTableFieldOfInterestDropdownOption.SPECIMEN_TYPE
    ]
  }], [ estimateBreakdownTableVariableOfInterest ]);

  const estimateBreakdownTableFieldOfInterest = useMemo(() => {
    const availableFieldsOfInterest = fieldOfInterestDropdownOptionGroups
      .flatMap((element) => element.options);

    if(availableFieldsOfInterest.includes(_estimateBreakdownTableFieldOfInterest)) {
      return _estimateBreakdownTableFieldOfInterest;
    }

    return availableFieldsOfInterest.at(0) ?? EstimateBreakdownTableFieldOfInterestDropdownOption.AGE_GROUP;
  }, [ _estimateBreakdownTableFieldOfInterest, fieldOfInterestDropdownOptionGroups ]);

  const getDisplayNameForEstimateBreakdownTableAndField: MersVisualizationInformation<
    string,
    EstimateBreakdownTableVariableOfInterestDropdownOption,
    EstimateBreakdownTableFieldOfInterestDropdownOption,
    EstimateBreakdownTableRegionTypeOfInterestDropdownOption,
    string
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
        groupHeader: 'Viral Prevalence Estimates',
        options: [
          EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_VIRAL_PREVALENCE,
          EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_VIRAL_PREVALENCE
        ]
      }],
      chosenDropdownOption: estimateBreakdownTableVariableOfInterest,
      dropdownOptionToLabelMap: {
        [EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_SEROPREVALENCE]: 'Aggregated Human Seroprevalence',
        [EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_SEROPREVALENCE]: 'Aggregated Animal Seroprevalence',
        [EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_HUMAN_VIRAL_PREVALENCE]: 'Aggregated Human Viral Prevalence',
        [EstimateBreakdownTableVariableOfInterestDropdownOption.AGGREGATED_ANIMAL_VIRAL_PREVALENCE]: 'Aggregated Animal Viral Prevalence',
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
      dropdownOptionGroups: fieldOfInterestDropdownOptionGroups,
      chosenDropdownOption: estimateBreakdownTableFieldOfInterest,
      dropdownOptionToLabelMap: {
        [EstimateBreakdownTableFieldOfInterestDropdownOption.AGE_GROUP]: "Age Group",
        [EstimateBreakdownTableFieldOfInterestDropdownOption.ANIMAL_SPECIES]: "Animal Species",
        [EstimateBreakdownTableFieldOfInterestDropdownOption.ANIMAL_SAMPLE_FRAME]: "Animal Sample Frame",
        [EstimateBreakdownTableFieldOfInterestDropdownOption.CAMEL_EXPOSURE_LEVEL]: "Camel Exposure Level",
        [EstimateBreakdownTableFieldOfInterestDropdownOption.SEX]: "Sex",
        [EstimateBreakdownTableFieldOfInterestDropdownOption.SPECIMEN_TYPE]: "Specimen Type"
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
        [EstimateBreakdownTableRegionTypeOfInterestDropdownOption.COUNTRY]: "Country or Area",
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
    setEstimateBreakdownTableRegionTypeOfInterest,
    fieldOfInterestDropdownOptionGroups
  ])

  const estimateBreakdownTableAndFieldTooltipContent: MersVisualizationInformation<
    string,
    EstimateBreakdownTableVariableOfInterestDropdownOption,
    EstimateBreakdownTableFieldOfInterestDropdownOption,
    string,
    string
  >['titleTooltipContent'] = useMemo(() => {
    return <WHORegionsTooltip />
  }, []);

  const renderVisualizationForEstimateBreakdownTableAndField: MersVisualizationInformation<
    string,
    EstimateBreakdownTableVariableOfInterestDropdownOption,
    EstimateBreakdownTableFieldOfInterestDropdownOption,
    string,
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