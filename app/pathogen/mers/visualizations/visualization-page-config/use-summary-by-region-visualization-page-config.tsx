import { useCallback, useMemo, useState } from "react";
import { SummaryByRegion, SummaryByRegionRegionDropdownOption, SummaryByRegionVariableOfInterestDropdownOption } from "../../dashboard/(visualizations)/summary-by-region";
import { UNRegionsTooltip, WHORegionsTooltip } from "@/components/customs/tooltip-content";
import assertNever from "assert-never";
import { MersVisualizationInformation } from "../visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";

export const useSummaryByRegionVisualizationPageConfig = () => {
  const [
    summaryByRegionVariableOfInterestSelectedDropdownOption,
    setSummaryByRegionVariableOfInterestSelectedDropdownOption,
  ] = useState<SummaryByRegionVariableOfInterestDropdownOption>(SummaryByRegionVariableOfInterestDropdownOption.MEDIAN_SEROPREVALENCE);

  const [
    summaryByRegionSelectedDropdownOption,
    setSummaryByRegionSelectedDropdownOption,
  ] = useState<SummaryByRegionRegionDropdownOption>(SummaryByRegionRegionDropdownOption.WHO_REGION);

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
    SummaryByRegionRegionDropdownOption
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
          SummaryByRegionVariableOfInterestDropdownOption.MEDIAN_SEROPREVALENCE
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
        [SummaryByRegionVariableOfInterestDropdownOption.MEDIAN_SEROPREVALENCE]: "Median Seroprevalence",
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
        ]
      }],
      chosenDropdownOption: summaryByRegionSelectedDropdownOption,
      dropdownOptionToLabelMap: {
        [SummaryByRegionRegionDropdownOption.WHO_REGION]: "WHO Region",
        [SummaryByRegionRegionDropdownOption.UN_REGION]: "UN Region"
      },
      onDropdownOptionChange: (option) => {
        setSummaryByRegionSelectedDropdownOption(option);
        setCurrentPageIndex(0);
      }
    },
    afterBothDropdownsHeaderText: " Over Time"
  }), [ summaryByRegionVariableOfInterestSelectedDropdownOption, setSummaryByRegionVariableOfInterestSelectedDropdownOption, summaryByRegionSelectedDropdownOption, setSummaryByRegionSelectedDropdownOption ])

  const renderVisualizationForSummaryByWhoRegion: MersVisualizationInformation<
    string, SummaryByRegionVariableOfInterestDropdownOption, SummaryByRegionRegionDropdownOption
  >['renderVisualization'] = useCallback(({ data }) => (
    <SummaryByRegion
      data={data}
      selectedVariableOfInterest={summaryByRegionVariableOfInterestSelectedDropdownOption}
      selectedRegion={summaryByRegionSelectedDropdownOption}
      numberOfPagesAvailable={numberOfPagesAvailable}
      setNumberOfPagesAvailable={setNumberOfPagesAvailable}
      currentPageIndex={currentPageIndex}
    />
  ), [ summaryByRegionVariableOfInterestSelectedDropdownOption, summaryByRegionSelectedDropdownOption, numberOfPagesAvailable, setNumberOfPagesAvailable, currentPageIndex ]);

  const summaryByWhoRegionTitleTooltipContent: MersVisualizationInformation<
    string, SummaryByRegionVariableOfInterestDropdownOption, SummaryByRegionRegionDropdownOption
  >['titleTooltipContent'] = useMemo(() => {
    if(summaryByRegionSelectedDropdownOption === SummaryByRegionRegionDropdownOption.WHO_REGION) {
      return <WHORegionsTooltip />
    }

    if(summaryByRegionSelectedDropdownOption === SummaryByRegionRegionDropdownOption.UN_REGION) {
      return <UNRegionsTooltip />
    }

    assertNever(summaryByRegionSelectedDropdownOption);
  }, [ summaryByRegionSelectedDropdownOption ]);

  return {
    getDisplayNameForSummaryByWhoRegion,
    renderVisualizationForSummaryByWhoRegion,
    summaryByWhoRegionTitleTooltipContent,
    numberOfPagesAvailable,
    setNumberOfPagesAvailable,
    currentPageIndex,
    setCurrentPageIndex
  }
}