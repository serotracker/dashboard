import { useCallback, useMemo, useState } from "react";
import { UNRegionsTooltip, WHORegionsTooltip } from "@/components/customs/tooltip-content";
import assertNever from "assert-never";
import { MersVisualizationInformation } from "../visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { EstimatesByRegion, EstimatesByRegionRegionDropdownOption, EstimatesByRegionVariableOfInterestDropdownOption } from "../../dashboard/(visualizations)/estimates-by-region";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { UnRegion, WhoRegion } from "@/gql/graphql";
import { defaultColoursForWhoRegions } from "@/lib/who-regions";
import { defaultColoursForUnRegions, unRegionEnumToLabelMap } from "@/lib/un-regions";
import { ModalState, ModalType } from "@/components/ui/modal/modal";
import { ColourPickerCustomizationSettingProps } from "@/components/ui/modal/customization-modal/colour-picker-customization-setting";
import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";

export const useEstimatesByRegionVisualizationPageConfig = () => {
  const [
    estimatesByRegionVariableOfInterest,
    setEstimatesByRegionVariableOfInterest,
  ] = useState<EstimatesByRegionVariableOfInterestDropdownOption>(EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE);

  const [
    estimatesByRegionSelectedRegion,
    setEstimatesByRegionSelectedRegion,
  ] = useState<EstimatesByRegionRegionDropdownOption>(EstimatesByRegionRegionDropdownOption.WHO_REGION);

  const [
    barColoursForWhoRegions,
    setBarColoursForWhoRegions,
  ] = useState<Record<WhoRegion, string>>(defaultColoursForWhoRegions);
  const [
    barColoursForUnRegions,
    setBarColoursForUnRegions,
  ] = useState<Record<UnRegion, string>>(defaultColoursForUnRegions);

  const getDisplayNameForEstimatesByRegion: MersVisualizationInformation<
    string,
    EstimatesByRegionVariableOfInterestDropdownOption,
    EstimatesByRegionRegionDropdownOption
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
      barColoursForWhoRegions={barColoursForWhoRegions}
      barColoursForUnRegions={barColoursForUnRegions}
      selectedVariableOfInterest={estimatesByRegionVariableOfInterest}
      selectedRegion={estimatesByRegionSelectedRegion}
      legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
    />
  ), [ estimatesByRegionVariableOfInterest, estimatesByRegionSelectedRegion, barColoursForWhoRegions, barColoursForUnRegions ]);

  const customizationModalConfigurationForEstimatesByRegion: MersVisualizationInformation<
    string,
    EstimatesByRegionVariableOfInterestDropdownOption,
    EstimatesByRegionRegionDropdownOption
  >['customizationModalConfiguration'] = useMemo(() => {
    if(estimatesByRegionSelectedRegion === EstimatesByRegionRegionDropdownOption.COUNTRY) {
      return undefined;
    }

    return {
      initialModalState: ModalState.CLOSED,
      disabled: false,
      modalType: ModalType.CUSTOMIZATION_MODAL,
      content: {
        paginationHoverClassname: "hover:bg-mersHover",
        paginationSelectedClassname: "bg-mers",
        customizationSettings: [
          ...(estimatesByRegionSelectedRegion === EstimatesByRegionRegionDropdownOption.WHO_REGION ? Object.values(WhoRegion).map((whoRegion): ColourPickerCustomizationSettingProps => ({
            type: CustomizationSettingType.COLOUR_PICKER,
            colourPickerName: `Colour for ${whoRegion}`,
            chosenColour: barColoursForWhoRegions[whoRegion],
            setChosenColour: (newChosenColour) => setBarColoursForWhoRegions({
              ...barColoursForWhoRegions,
              [whoRegion]: newChosenColour
            })
          })) : []),
          ...(estimatesByRegionSelectedRegion === EstimatesByRegionRegionDropdownOption.UN_REGION ? Object.values(UnRegion).map((unRegion): ColourPickerCustomizationSettingProps => ({
            type: CustomizationSettingType.COLOUR_PICKER,
            colourPickerName: `Colour for ${unRegionEnumToLabelMap[unRegion]}`,
            chosenColour: barColoursForUnRegions[unRegion],
            setChosenColour: (newChosenColour) => setBarColoursForUnRegions({
              ...barColoursForUnRegions,
              [unRegion]: newChosenColour
            })
          })) : [])
        ]
      }
    }
  }, [ barColoursForWhoRegions, setBarColoursForWhoRegions, barColoursForUnRegions, setBarColoursForUnRegions, estimatesByRegionSelectedRegion ]);

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
    customizationModalConfigurationForEstimatesByRegion,
    renderVisualizationForEstimatesByRegion,
    estimatesByRegionTitleTooltipContent,
  }
}