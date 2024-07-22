import { useCallback, useMemo, useState } from "react";
import { UNRegionsTooltip, WHORegionsTooltip } from "@/components/customs/tooltip-content";
import assertNever from "assert-never";
import { MersVisualizationInformation } from "../visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { EstimatesByRegion, EstimatesByRegionRegionDropdownOption, EstimatesByRegionVariableOfInterestDropdownOption } from "../../dashboard/(visualizations)/estimates-by-region";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";

export const useEstimatesByRegionVisualizationPageConfig = () => {
  const [
    estimatesByRegionVariableOfInterest,
    setEstimatesByRegionVariableOfInterest,
  ] = useState<EstimatesByRegionVariableOfInterestDropdownOption>(EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE);

  const [
    estimatesByRegionSelectedRegion,
    setEstimatesByRegionSelectedRegion,
  ] = useState<EstimatesByRegionRegionDropdownOption>(EstimatesByRegionRegionDropdownOption.WHO_REGION);

  const getDisplayNameForEstimatesByRegion: MersVisualizationInformation<
    string,
    EstimatesByRegionVariableOfInterestDropdownOption,
    EstimatesByRegionRegionDropdownOption
  >['getDisplayName'] = useCallback(() => ({
    type: VisualizationDisplayNameType.WITH_DOUBLE_DROPDOWN,
    beforeBothDropdownsHeaderText: "View All ",
    firstDropdownProps: {
      dropdownName: 'Variable of Interest Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Seroprevalence Estimates',
        options: [
          EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE,
          EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE,
        ]
      }, {
        groupHeader: 'Viral Positive Prevalence Estimates',
        options: [
          EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_VIRAL_PREVALENCE,
          EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_VIRAL_PREVALENCE,
        ]
      }],
      chosenDropdownOption: estimatesByRegionVariableOfInterest,
      dropdownOptionToLabelMap: {
        [EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE]: "Human Seroprevalence Estimates",
        [EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE]: "Animal Seroprevalence Estimates",
        [EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_VIRAL_PREVALENCE]: "Human Viral Prevalence Estimates",
        [EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_VIRAL_PREVALENCE]: "Animal Viral Prevalence Estimates",
      },
      onDropdownOptionChange: (option) => {
        setEstimatesByRegionVariableOfInterest(option);
      }
    },
    betweenDropdownsHeaderText: " Grouped By ",
    secondDropdownProps: {
      dropdownName: 'Region Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Regions',
        options: [
          EstimatesByRegionRegionDropdownOption.WHO_REGION,
          EstimatesByRegionRegionDropdownOption.UN_REGION,
          EstimatesByRegionRegionDropdownOption.COUNTRY,
        ]
      }],
      chosenDropdownOption: estimatesByRegionSelectedRegion,
      dropdownOptionToLabelMap: {
        [EstimatesByRegionRegionDropdownOption.WHO_REGION]: "WHO Region",
        [EstimatesByRegionRegionDropdownOption.UN_REGION]: "UN Region",
        [EstimatesByRegionRegionDropdownOption.COUNTRY]: "Country",
      },
      onDropdownOptionChange: (option) => {
        setEstimatesByRegionSelectedRegion(option);
      }
    },
    afterBothDropdownsHeaderText: " With 95% Confidence Intervals"
  }), [ estimatesByRegionVariableOfInterest, setEstimatesByRegionVariableOfInterest, estimatesByRegionSelectedRegion, setEstimatesByRegionSelectedRegion ])

  const renderVisualizationForEstimatesByRegion: MersVisualizationInformation<
    string, EstimatesByRegionVariableOfInterestDropdownOption, EstimatesByRegionRegionDropdownOption
  >['renderVisualization'] = useCallback(({ data }) => (
    <EstimatesByRegion
      data={data}
      selectedVariableOfInterest={estimatesByRegionVariableOfInterest}
      selectedRegion={estimatesByRegionSelectedRegion}
      legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
    />
  ), [ estimatesByRegionVariableOfInterest, estimatesByRegionSelectedRegion ]);

  const estimatesByRegionTitleTooltipContent: MersVisualizationInformation<
    string, EstimatesByRegionVariableOfInterestDropdownOption, EstimatesByRegionRegionDropdownOption
  >['titleTooltipContent'] = useMemo(() => {
    if(estimatesByRegionSelectedRegion === EstimatesByRegionRegionDropdownOption.WHO_REGION) {
      return <WHORegionsTooltip />
    }

    if(estimatesByRegionSelectedRegion === EstimatesByRegionRegionDropdownOption.UN_REGION) {
      return <UNRegionsTooltip />
    }

    if(estimatesByRegionSelectedRegion === EstimatesByRegionRegionDropdownOption.COUNTRY) {
      return null;
    }

    assertNever(estimatesByRegionSelectedRegion);
  }, [ estimatesByRegionSelectedRegion ]);

  return {
    getDisplayNameForEstimatesByRegion,
    renderVisualizationForEstimatesByRegion,
    estimatesByRegionTitleTooltipContent,
  }
}