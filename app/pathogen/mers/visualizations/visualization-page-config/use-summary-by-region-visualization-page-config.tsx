import { useCallback, useMemo, useState } from "react";
import defaultColours from 'tailwindcss/colors'
import { SummaryByRegion, SummaryByRegionRegionDropdownOption, SummaryByRegionVariableOfInterestDropdownOption } from "../../dashboard/(visualizations)/summary-by-region";
import { UNRegionsTooltip, WHORegionsTooltip } from "@/components/customs/tooltip-content";
import assertNever from "assert-never";
import { MersVisualizationInformation } from "../visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { UnRegion, WhoRegion } from "@/gql/graphql";
import { ModalState, ModalType } from "@/components/ui/modal/modal";
import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";
import { defaultColoursForWhoRegions } from "@/lib/who-regions";
import { defaultColoursForUnRegions, unRegionEnumToLabelMap } from "@/lib/un-regions";
import { ColourPickerCustomizationSettingProps } from "@/components/ui/modal/customization-modal/colour-picker-customization-setting";
import { eventsProvidedCourtesyOfFaoTooltipContent } from "../../dashboard/(map)/use-mers-map-customization-modal";

export const useSummaryByRegionVisualizationPageConfig = () => {
  const [
    summaryByRegionVariableOfInterestSelectedDropdownOption,
    setSummaryByRegionVariableOfInterestSelectedDropdownOption,
  ] = useState<SummaryByRegionVariableOfInterestDropdownOption>(SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE);

  const [
    summaryByRegionSelectedDropdownOption,
    setSummaryByRegionSelectedDropdownOption,
  ] = useState<SummaryByRegionRegionDropdownOption>(SummaryByRegionRegionDropdownOption.WHO_REGION);

  const [
    barColoursForWhoRegions,
    setBarColoursForWhoRegions,
  ] = useState<Record<WhoRegion, string>>(defaultColoursForWhoRegions);
  const [
    barColoursForUnRegions,
    setBarColoursForUnRegions,
  ] = useState<Record<UnRegion, string>>(defaultColoursForUnRegions);

  const [
    numberOfPagesAvailable,
    _setNumberOfPagesAvailable
  ] = useState<number>(1);

  const [
    currentPageIndex,
    setCurrentPageIndex
  ] = useState<number>(0);

  const setNumberOfPagesAvailable = useCallback((newNumberOfPagesAvailable: number) => {
    const smallestPageIndexAvailable = 0;
    const largestPageIndexAvailable = newNumberOfPagesAvailable - 1;
    let newCurrentPageIndex = currentPageIndex;

    if(newCurrentPageIndex > largestPageIndexAvailable) {
      newCurrentPageIndex = largestPageIndexAvailable;
    }

    if(newCurrentPageIndex < smallestPageIndexAvailable) {
      newCurrentPageIndex = smallestPageIndexAvailable;
    }

    _setNumberOfPagesAvailable(newNumberOfPagesAvailable);
    setCurrentPageIndex(newCurrentPageIndex);
  }, [ _setNumberOfPagesAvailable, setCurrentPageIndex, currentPageIndex ]);

  const getDisplayNameForSummaryByWhoRegion: MersVisualizationInformation<
    string,
    SummaryByRegionVariableOfInterestDropdownOption,
    SummaryByRegionRegionDropdownOption,
    string
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
          SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE,
          SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_SEROPREVALENCE
        ]
      }, {
        groupHeader: 'Viral Positive Prevalence Estimates',
        options: [
          SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_VIRAL_POSITIVE_PREVALENCE,
          SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_VIRAL_POSITIVE_PREVALENCE
        ]
      }, {
        groupHeader: 'Cases and Deaths',
        options: [
          SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES,
          SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES,
          SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS,
        ]
      }],
      chosenDropdownOption: summaryByRegionVariableOfInterestSelectedDropdownOption,
      dropdownOptionToLabelMap: {
        [SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE]: "Median Human Seroprevalence",
        [SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_SEROPREVALENCE]: "Median Animal Seroprevalence",
        [SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_VIRAL_POSITIVE_PREVALENCE]: "Median Human Viral Positive Prevalence",
        [SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_VIRAL_POSITIVE_PREVALENCE]: "Median Animal Viral Positive Prevalence",
        [SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES]: "Confirmed Animal Cases",
        [SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES]: "Confirmed Human Cases",
        [SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS]: "Confirmed Human Deaths"
      },
      onDropdownOptionChange: (option) => {
        setSummaryByRegionVariableOfInterestSelectedDropdownOption(option);
        setCurrentPageIndex(0);
      }
    },
    betweenDropdownsHeaderText: " By ",
    secondDropdownProps: {
      dropdownName: 'Region Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Regions',
        options: [
          SummaryByRegionRegionDropdownOption.WHO_REGION,
          SummaryByRegionRegionDropdownOption.UN_REGION,
          SummaryByRegionRegionDropdownOption.COUNTRY,
        ]
      }],
      chosenDropdownOption: summaryByRegionSelectedDropdownOption,
      dropdownOptionToLabelMap: {
        [SummaryByRegionRegionDropdownOption.WHO_REGION]: "WHO Region",
        [SummaryByRegionRegionDropdownOption.UN_REGION]: "UN Region",
        [SummaryByRegionRegionDropdownOption.COUNTRY]: "Country"
      },
      onDropdownOptionChange: (option) => {
        setSummaryByRegionSelectedDropdownOption(option);
        setCurrentPageIndex(0);
      }
    },
    afterBothDropdownsHeaderText: " Over Time"
  }), [ summaryByRegionVariableOfInterestSelectedDropdownOption, setSummaryByRegionVariableOfInterestSelectedDropdownOption, summaryByRegionSelectedDropdownOption, setSummaryByRegionSelectedDropdownOption ])

  const customizationModalConfigurationForSummaryByRegion: MersVisualizationInformation<
    string,
    SummaryByRegionVariableOfInterestDropdownOption,
    SummaryByRegionRegionDropdownOption,
    string
  >['customizationModalConfiguration'] = useMemo(() => {
    if(summaryByRegionSelectedDropdownOption === SummaryByRegionRegionDropdownOption.COUNTRY) {
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
          ...(summaryByRegionSelectedDropdownOption === SummaryByRegionRegionDropdownOption.WHO_REGION ? Object.values(WhoRegion).map((whoRegion): ColourPickerCustomizationSettingProps => ({
            type: CustomizationSettingType.COLOUR_PICKER,
            colourPickerName: `Colour for ${whoRegion}`,
            chosenColour: barColoursForWhoRegions[whoRegion],
            setChosenColour: (newChosenColour) => setBarColoursForWhoRegions({
              ...barColoursForWhoRegions,
              [whoRegion]: newChosenColour
            })
          })) : []),
          ...(summaryByRegionSelectedDropdownOption === SummaryByRegionRegionDropdownOption.UN_REGION ? Object.values(UnRegion).map((unRegion): ColourPickerCustomizationSettingProps => ({
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
  }, [ barColoursForWhoRegions, setBarColoursForWhoRegions, barColoursForUnRegions, setBarColoursForUnRegions, summaryByRegionSelectedDropdownOption ]);

  const renderVisualizationForSummaryByWhoRegion: MersVisualizationInformation<
    string,
    SummaryByRegionVariableOfInterestDropdownOption,
    SummaryByRegionRegionDropdownOption,
    string
  >['renderVisualization'] = useCallback(({ data }) => (
    <SummaryByRegion
      data={data}
      selectedVariableOfInterest={summaryByRegionVariableOfInterestSelectedDropdownOption}
      barColoursForWhoRegions={barColoursForWhoRegions}
      barColoursForUnRegions={barColoursForUnRegions}
      selectedRegion={summaryByRegionSelectedDropdownOption}
      numberOfPagesAvailable={numberOfPagesAvailable}
      setNumberOfPagesAvailable={setNumberOfPagesAvailable}
      currentPageIndex={currentPageIndex}
    />
  ), [ summaryByRegionVariableOfInterestSelectedDropdownOption, summaryByRegionSelectedDropdownOption, numberOfPagesAvailable, setNumberOfPagesAvailable, currentPageIndex, barColoursForUnRegions, barColoursForWhoRegions ]);

  const summaryByWhoRegionTitleTooltipContent: MersVisualizationInformation<
    string,
    SummaryByRegionVariableOfInterestDropdownOption,
    SummaryByRegionRegionDropdownOption,
    string
  >['titleTooltipContent'] = useMemo(() => {
    if(
      summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES
      || summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES
      || summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS
    ) {
      return eventsProvidedCourtesyOfFaoTooltipContent;
    }

    if(summaryByRegionSelectedDropdownOption === SummaryByRegionRegionDropdownOption.WHO_REGION) {
      return <WHORegionsTooltip />
    }

    if(summaryByRegionSelectedDropdownOption === SummaryByRegionRegionDropdownOption.UN_REGION) {
      return <UNRegionsTooltip />
    }

    if(summaryByRegionSelectedDropdownOption === SummaryByRegionRegionDropdownOption.COUNTRY) {
      return undefined;
    }

    assertNever(summaryByRegionSelectedDropdownOption);
  }, [ summaryByRegionSelectedDropdownOption, summaryByRegionVariableOfInterestSelectedDropdownOption ]);

  return {
    getDisplayNameForSummaryByWhoRegion,
    renderVisualizationForSummaryByWhoRegion,
    customizationModalConfigurationForSummaryByRegion,
    summaryByWhoRegionTitleTooltipContent,
    numberOfPagesAvailable,
    setNumberOfPagesAvailable,
    currentPageIndex,
    setCurrentPageIndex
  }
}