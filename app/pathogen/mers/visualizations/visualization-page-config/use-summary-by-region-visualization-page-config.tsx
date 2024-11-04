import { useCallback, useContext, useMemo, useState } from "react";
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
import { MersContext, isHumanMersEstimate, isAnimalMersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { MersMacroSampleFramesContext, MersMacroSampleFrameType, mersMacroSampleFrameTypeToTextMap } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-macro-sample-frames-context";
import uniq from "lodash/uniq";

export const useSummaryByRegionVisualizationPageConfig = () => {
  const { filteredData } = useContext(MersContext);
  const { macroSampleFrames, allHumanSampleFrames, adjustMacroSampleFrame } = useContext(MersMacroSampleFramesContext);
  const [
    summaryByRegionVariableOfInterestSelectedDropdownOption,
    setSummaryByRegionVariableOfInterestSelectedDropdownOption,
  ] = useState<SummaryByRegionVariableOfInterestDropdownOption>(SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE);

  const [
    summaryByRegionSelectedDropdownOption,
    setSummaryByRegionSelectedDropdownOption,
  ] = useState<SummaryByRegionRegionDropdownOption>(SummaryByRegionRegionDropdownOption.WHO_REGION);

  const [
    _summaryByRegionSelectedAnimalSampleFrameOrMacroSampleFrame,
    setSummaryByRegionSelectedAnimalSampleFrameOrMacroSampleFrame,
  ] = useState<string>(MersMacroSampleFrameType.HIGH_RISK_POPULATIONS);

  const availableSampleFrames: string[] = useMemo(() => {
    if(
      summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE ||
      summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_VIRAL_PREVALENCE
    ) {
      const allHumanSampleFrames = uniq(filteredData
        .filter((estimate) => isHumanMersEstimate(estimate))
        .flatMap((estimate) => [
          ...(estimate.primaryEstimateInfo.sampleFrame ? [estimate.primaryEstimateInfo.sampleFrame] : []),
          ...estimate.occupationSubestimates.flatMap((subestimate) => subestimate.sampleFrame ? [ subestimate.sampleFrame ] : [])
        ])
      );

      const allHumanMacroSampleFrames = macroSampleFrames
        .filter((macroSampleFrame) => macroSampleFrame.macroSampleFrame !== MersMacroSampleFrameType.UNCATEGORIZED)
        .filter((macroSampleFrame) => macroSampleFrame.sampleFrames.some((sampleFrame) => allHumanSampleFrames.includes(sampleFrame)))
        .map((macroSampleFrames) => macroSampleFrames.macroSampleFrame);

      return allHumanMacroSampleFrames.length > 0 ? allHumanMacroSampleFrames : [ 'The Entire Population' ];
    }

    if(
      summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_SEROPREVALENCE ||
      summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_VIRAL_PREVALENCE
    ) {
      const allAnimalSampleFrames = uniq(filteredData
        .filter((estimate) => isAnimalMersEstimate(estimate))
        .flatMap((estimate) => [
          ...estimate.primaryEstimateInfo.animalDetectionSettings,
          ...estimate.animalSamplingContextSubestimates.flatMap((subestimate) => subestimate.animalDetectionSettings)
        ])
      );

      return allAnimalSampleFrames.length > 0 ? allAnimalSampleFrames : [ 'The Entire Population' ];
    }
    if(
      summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES ||
      summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES ||
      summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS
    ) {
      return [ 'The Entire Population' ];
    }

    assertNever(summaryByRegionVariableOfInterestSelectedDropdownOption)
  }, [ filteredData, summaryByRegionVariableOfInterestSelectedDropdownOption, macroSampleFrames ]);

  const summaryByRegionSelectedAnimalSampleFrameOrMacroSampleFrame = useMemo(() => {
    if(availableSampleFrames.includes(_summaryByRegionSelectedAnimalSampleFrameOrMacroSampleFrame)) {
      return _summaryByRegionSelectedAnimalSampleFrameOrMacroSampleFrame;
    }

    return availableSampleFrames.at(0) ?? 'The Entire Population';
  }, [ _summaryByRegionSelectedAnimalSampleFrameOrMacroSampleFrame, availableSampleFrames ])

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
          SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE,
          SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_SEROPREVALENCE
        ]
      }, {
        groupHeader: 'Viral Prevalence Estimates',
        options: [
          SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_VIRAL_PREVALENCE,
          SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_VIRAL_PREVALENCE
        ]
      },
      ...(process.env.NEXT_PUBLIC_FAO_EVENT_DATA_ENABLED === 'true' ? [{
        groupHeader: 'Cases and Deaths',
        options: [
          SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES,
          SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES,
          SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS,
        ]
      }] : [])
      ],
      chosenDropdownOption: summaryByRegionVariableOfInterestSelectedDropdownOption,
      dropdownOptionToLabelMap: {
        [SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE]: "Median Human Seroprevalence",
        [SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_SEROPREVALENCE]: "Median Animal Seroprevalence",
        [SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_VIRAL_PREVALENCE]: "Median Human Viral Prevalence",
        [SummaryByRegionVariableOfInterestDropdownOption.ANIMAL_MEDIAN_VIRAL_PREVALENCE]: "Median Animal Viral Prevalence",
        [SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES]: "Confirmed Animal Cases",
        [SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES]: "Confirmed Human Cases",
        [SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS]: "Confirmed Human Deaths"
      },
      onDropdownOptionChange: (option) => {
        setSummaryByRegionVariableOfInterestSelectedDropdownOption(option);
        setCurrentPageIndex(0);
      }
    },
    betweenFirstAndSecondDropdownHeaderText: " By ",
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
    betweenSecondAndThirdDropdownHeaderText: " For ",
    thirdDropdownProps: {
      dropdownName: 'Sample Frame Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Sample Frame',
        options: availableSampleFrames
      }],
      chosenDropdownOption: summaryByRegionSelectedAnimalSampleFrameOrMacroSampleFrame,
      dropdownOptionToLabelMap: mersMacroSampleFrameTypeToTextMap,
      onDropdownOptionChange: (option) => {
        setSummaryByRegionSelectedAnimalSampleFrameOrMacroSampleFrame(option);
        setCurrentPageIndex(0);
      }
    },
    afterAllDropdownsHeaderText: " Over Time"
  }), [
    summaryByRegionVariableOfInterestSelectedDropdownOption,
    setSummaryByRegionVariableOfInterestSelectedDropdownOption,
    summaryByRegionSelectedDropdownOption,
    setSummaryByRegionSelectedDropdownOption,
    availableSampleFrames,
    summaryByRegionSelectedAnimalSampleFrameOrMacroSampleFrame,
    setSummaryByRegionSelectedAnimalSampleFrameOrMacroSampleFrame
  ])

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
          ...((
            summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE ||
            summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_VIRAL_PREVALENCE
          )
            ? macroSampleFrames
              .filter((macroSampleFrame): macroSampleFrame is Omit<
                typeof macroSampleFrame, 'macroSampleFrame'
              > & {
                macroSampleFrame: (
                  MersMacroSampleFrameType.GENERAL_POPULATION |
                  MersMacroSampleFrameType.HIGH_RISK_NOT_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS |
                  MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS
                )
              } => (
                macroSampleFrame.macroSampleFrame === MersMacroSampleFrameType.GENERAL_POPULATION ||
                macroSampleFrame.macroSampleFrame === MersMacroSampleFrameType.HIGH_RISK_NOT_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS ||
                macroSampleFrame.macroSampleFrame === MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS
              ))
              .map((macroSampleFrame) => ({
                type: CustomizationSettingType.MULTI_SELECT_DROPDOWN as const,
                dropdownName: `Sample frames included in "${mersMacroSampleFrameTypeToTextMap[macroSampleFrame.macroSampleFrame]}"`,
                heading: 'Selected Sample Frames',
                options: allHumanSampleFrames,
                optionToLabelMap: {},
                selected: macroSampleFrame.sampleFrames,
                handleOnChange: (newSampleFrames: string[]) => adjustMacroSampleFrame({
                  macroSampleFrame: macroSampleFrame.macroSampleFrame,
                  newSampleFrames
                })
              }))
            : []
          ),
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
  }, [
    barColoursForWhoRegions,
    setBarColoursForWhoRegions,
    barColoursForUnRegions,
    setBarColoursForUnRegions,
    summaryByRegionSelectedDropdownOption,
    summaryByRegionVariableOfInterestSelectedDropdownOption,
    allHumanSampleFrames,
    macroSampleFrames,
    adjustMacroSampleFrame
  ]);

  const renderVisualizationForSummaryByWhoRegion: MersVisualizationInformation<
    string,
    SummaryByRegionVariableOfInterestDropdownOption,
    SummaryByRegionRegionDropdownOption,
    string
  >['renderVisualization'] = useCallback(({ data }) => (
    <SummaryByRegion
      data={data}
      selectedAnimalSampleFrameOrMacroSampleFrame={summaryByRegionSelectedAnimalSampleFrameOrMacroSampleFrame}
      selectedVariableOfInterest={summaryByRegionVariableOfInterestSelectedDropdownOption}
      barColoursForWhoRegions={barColoursForWhoRegions}
      barColoursForUnRegions={barColoursForUnRegions}
      selectedRegion={summaryByRegionSelectedDropdownOption}
      numberOfPagesAvailable={numberOfPagesAvailable}
      setNumberOfPagesAvailable={setNumberOfPagesAvailable}
      currentPageIndex={currentPageIndex}
    />
  ), [
    summaryByRegionVariableOfInterestSelectedDropdownOption,
    summaryByRegionSelectedDropdownOption,
    numberOfPagesAvailable,
    setNumberOfPagesAvailable,
    currentPageIndex,
    barColoursForUnRegions,
    barColoursForWhoRegions,
    summaryByRegionSelectedAnimalSampleFrameOrMacroSampleFrame
  ]);

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
      if(
        summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE ||
        summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_VIRAL_PREVALENCE
      ) {
        return (
          <WHORegionsTooltip>
            <p>Please note that the high risk and general population categories are descriptive statistics and studies within those categories are very heterogeneous in terms of assay quality and study design.</p>
            <p>The cogwheel to the left can be used to change which sample frames are considered general population or high risk.</p>
          </WHORegionsTooltip>
        );
      }
      return <WHORegionsTooltip />
    }

    if(summaryByRegionSelectedDropdownOption === SummaryByRegionRegionDropdownOption.UN_REGION) {
      if(
        summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE ||
        summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_VIRAL_PREVALENCE
      ) {
        return (
          <UNRegionsTooltip>
            <p>Please note that the high risk and general population categories are descriptive statistics and studies within those categories are very heterogeneous in terms of assay quality and study design.</p>
            <p>The cogwheel to the left can be used to change which sample frames are considered general population or high risk.</p>
          </UNRegionsTooltip>
        );
      }

      return <UNRegionsTooltip />
    }

    if(summaryByRegionSelectedDropdownOption === SummaryByRegionRegionDropdownOption.COUNTRY) {
      if(
        summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_SEROPREVALENCE ||
        summaryByRegionVariableOfInterestSelectedDropdownOption === SummaryByRegionVariableOfInterestDropdownOption.HUMAN_MEDIAN_VIRAL_PREVALENCE
      ) {
        return (
          <div>
            <p>Please note that the high risk and general population categories are descriptive statistics and studies within those categories are very heterogeneous in terms of assay quality and study design.</p>
            <p>The cogwheel to the left can be used to change which sample frames are considered general population or high risk.</p>
          </div>
        );
      }

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