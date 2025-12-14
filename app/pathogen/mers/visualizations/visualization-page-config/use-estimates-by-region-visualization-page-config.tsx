import { useCallback, useContext, useMemo, useState } from "react";
import { ClopperPearsonConfidenceIntervalCalculationTooltip, SampleSizeRestrictionTooltip, UNRegionsTooltip, WHORegionsTooltip } from "@/components/customs/tooltip-content";
import assertNever from "assert-never";
import { MersVisualizationInformation } from "../visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { EstimatesByRegion, EstimatesByRegionAssayClassificationDropdownOption, EstimatesByRegionRegionDropdownOption, EstimatesByRegionVariableOfInterestDropdownOption } from "../../dashboard/(visualizations)/estimates-by-region";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { UnRegion, WhoRegion } from "@/gql/graphql";
import { defaultColoursForWhoRegions } from "@/lib/who-regions";
import { defaultColoursForUnRegions, unRegionEnumToLabelMap } from "@/lib/un-regions";
import { ModalState, ModalType } from "@/components/ui/modal/modal";
import { ColourPickerCustomizationSettingProps } from "@/components/ui/modal/customization-modal/colour-picker-customization-setting";
import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";
import { AnimalMersSeroprevalenceEstimate, AnimalMersViralEstimate, HumanMersSeroprevalenceEstimate, HumanMersViralEstimate, isAnimalMersSeroprevalenceEstimate, isAnimalMersViralEstimate, isHumanMersSeroprevalenceEstimate, isHumanMersViralEstimate, MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { MersAssayClassification, MersAssayClassificationContext, mersAssayClassificationToTextMap } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-assay-classification-content";
import { MersFilterMetadataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-filter-metadata-context";
import { SummaryByRegionVariableOfInterestDropdownOption } from "../../dashboard/(visualizations)/summary-by-region";
import uniq from "lodash/uniq";
import { MersMacroSampleFramesContext, MersMacroSampleFrameType, mersMacroSampleFrameTypeToTextMap } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-macro-sample-frames-context";

export const useEstimatesByRegionVisualizationPageConfig = () => {
  const { numberOfNonTypenameFiltersApplied } = useContext(MersFilterMetadataContext)
  const [
    estimatesByRegionVariableOfInterest,
    setEstimatesByRegionVariableOfInterest,
  ] = useState<EstimatesByRegionVariableOfInterestDropdownOption>(EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE);

  const [
    _estimatesByRegionSelectedAnimalSampleFrameOrMacroSampleFrame,
    setEstimatesByRegionSelectedAnimalSampleFrameOrMacroSampleFrame,
  ] = useState<string>(MersMacroSampleFrameType.HIGH_RISK_POPULATIONS);

  const [
    estimatesByRegionSelectedRegion,
    setEstimatesByRegionSelectedRegion,
  ] = useState<EstimatesByRegionRegionDropdownOption>(EstimatesByRegionRegionDropdownOption.WHO_REGION);

  const [
    _estimatesByRegionSelectedAssayClassification,
    setEstimatesByRegionSelectedAssayClassification,
  ] = useState<EstimatesByRegionAssayClassificationDropdownOption>(EstimatesByRegionAssayClassificationDropdownOption.CONFIRMATORY);
  const { macroSampleFrames, allHumanSampleFrames, adjustMacroSampleFrame } = useContext(MersMacroSampleFramesContext);

  const [
    barColoursForWhoRegions,
    setBarColoursForWhoRegions,
  ] = useState<Record<WhoRegion, string>>(defaultColoursForWhoRegions);
  const [
    barColoursForUnRegions,
    setBarColoursForUnRegions,
  ] = useState<Record<UnRegion, string>>(defaultColoursForUnRegions);

  const { filteredData } = useContext(MersContext)
  const { allAssays, assayClassifications, adjustAssayClassification } = useContext(MersAssayClassificationContext)

  const humanMersSeroprevalenceEstimates = useMemo(() => filteredData
    .filter((dataPoint) => dataPoint.primaryEstimateInfo.sampleDenominator && dataPoint.primaryEstimateInfo.sampleDenominator >= 15)
    .filter((dataPoint): dataPoint is HumanMersSeroprevalenceEstimate => isHumanMersSeroprevalenceEstimate(dataPoint)
  ), [ filteredData ]);
  const animalMersSeroprevalenceEstimates = useMemo(() => filteredData
    .filter((dataPoint) => dataPoint.primaryEstimateInfo.sampleDenominator && dataPoint.primaryEstimateInfo.sampleDenominator >= 15)
    .filter((dataPoint): dataPoint is AnimalMersSeroprevalenceEstimate => isAnimalMersSeroprevalenceEstimate(dataPoint)
  ), [ filteredData ]);
  const humanMersViralEstimates = useMemo(() => filteredData
    .filter((dataPoint) => dataPoint.primaryEstimateInfo.sampleDenominator && dataPoint.primaryEstimateInfo.sampleDenominator >= 15)
    .filter((dataPoint): dataPoint is HumanMersViralEstimate => isHumanMersViralEstimate(dataPoint)
  ), [ filteredData ]);
  const animalMersViralEstimates = useMemo(() => filteredData 
    .filter((dataPoint) => dataPoint.primaryEstimateInfo.sampleDenominator && dataPoint.primaryEstimateInfo.sampleDenominator >= 15)
    .filter((dataPoint): dataPoint is AnimalMersViralEstimate => isAnimalMersViralEstimate(dataPoint)
  ), [ filteredData ]);

  const availableDropdownOptionGroups = useMemo(() => {
    const returnValue = [
      ...(humanMersSeroprevalenceEstimates.length > 0 ? [ EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE ] : []),
      ...(animalMersSeroprevalenceEstimates.length > 0 ? [ EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE ] : []),
      ...(humanMersViralEstimates.length > 0 ? [ EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_VIRAL_PREVALENCE ] : []),
      ...(animalMersViralEstimates.length > 0 ? [ EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_VIRAL_PREVALENCE ] : []),
    ];

    if(returnValue.length === 0) {
      return [ EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE ];
    }

    return returnValue;
  }, [ humanMersSeroprevalenceEstimates, animalMersSeroprevalenceEstimates, humanMersViralEstimates, animalMersViralEstimates ])

  const availableSampleFrames: string[] = useMemo(() => {
    if( estimatesByRegionVariableOfInterest === EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE ) {
      const allHumanSampleFrames = uniq(humanMersSeroprevalenceEstimates
        .flatMap((estimate) => [
          ...estimate.primaryEstimateInfo.sampleFrames,
          ...estimate.occupationSubestimates.flatMap((subestimate) => subestimate.sampleFrames)
        ])
      );

      const allHumanMacroSampleFrames = macroSampleFrames
        .filter((macroSampleFrame) => [
          MersMacroSampleFrameType.GENERAL_POPULATION,
          MersMacroSampleFrameType.HIGH_RISK_POPULATIONS,
          MersMacroSampleFrameType.HIGH_RISK_CLINICAL_MONITORING,
          MersMacroSampleFrameType.HIGH_RISK_HEALTHCARE_WORKERS,
          MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS,
        ].includes(macroSampleFrame.macroSampleFrame))
        .filter((macroSampleFrame) => macroSampleFrame.sampleFrames.some((sampleFrame) => allHumanSampleFrames.includes(sampleFrame)))
        .map((macroSampleFrames) => macroSampleFrames.macroSampleFrame);

      return allHumanMacroSampleFrames.length > 0 ? allHumanMacroSampleFrames : [ 'Any Population' ];
    }
    if( estimatesByRegionVariableOfInterest === EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_VIRAL_PREVALENCE ) {
      const allHumanSampleFrames = uniq(humanMersViralEstimates
        .flatMap((estimate) => [
          ...estimate.primaryEstimateInfo.sampleFrames,
          ...estimate.occupationSubestimates.flatMap((subestimate) => subestimate.sampleFrames)
        ])
      );

      const allHumanMacroSampleFrames = macroSampleFrames
        .filter((macroSampleFrame) => [
          MersMacroSampleFrameType.GENERAL_POPULATION,
          MersMacroSampleFrameType.HIGH_RISK_POPULATIONS,
          MersMacroSampleFrameType.HIGH_RISK_CLINICAL_MONITORING,
          MersMacroSampleFrameType.HIGH_RISK_HEALTHCARE_WORKERS,
          MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS,
        ].includes(macroSampleFrame.macroSampleFrame))
        .filter((macroSampleFrame) => macroSampleFrame.sampleFrames.some((sampleFrame) => allHumanSampleFrames.includes(sampleFrame)))
        .map((macroSampleFrames) => macroSampleFrames.macroSampleFrame);

      return allHumanMacroSampleFrames.length > 0 ? allHumanMacroSampleFrames : [ 'Any Population' ];
    }

    if( estimatesByRegionVariableOfInterest === EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE ) {
      return [ 'Any Population' ];
    }

    if( estimatesByRegionVariableOfInterest === EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_VIRAL_PREVALENCE ) {
      return [ 'Any Population' ];
    }

    assertNever(estimatesByRegionVariableOfInterest)
  }, [ estimatesByRegionVariableOfInterest, macroSampleFrames, humanMersViralEstimates, humanMersSeroprevalenceEstimates ]);

  const estimatesByRegionSelectedAnimalSampleFrameOrMacroSampleFrame = useMemo(() => {
    if(availableSampleFrames.includes(_estimatesByRegionSelectedAnimalSampleFrameOrMacroSampleFrame)) {
      return _estimatesByRegionSelectedAnimalSampleFrameOrMacroSampleFrame;
    }

    return availableSampleFrames.at(0) ?? 'Any Population';
  }, [ _estimatesByRegionSelectedAnimalSampleFrameOrMacroSampleFrame, availableSampleFrames ])

  const cleanedChosenDropdownOption = useMemo(() => {
    if(availableDropdownOptionGroups.includes(estimatesByRegionVariableOfInterest)) {
      return estimatesByRegionVariableOfInterest;
    }

    return availableDropdownOptionGroups.at(0) ?? EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE;
  }, [ estimatesByRegionVariableOfInterest, availableDropdownOptionGroups ])

  const assayClassificationOptions = useMemo(() => {
    if(
      cleanedChosenDropdownOption === EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE ||
      cleanedChosenDropdownOption === EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE
    ) {
      return [ EstimatesByRegionAssayClassificationDropdownOption.SCREENING, EstimatesByRegionAssayClassificationDropdownOption.CONFIRMATORY ]
    }

    return [ EstimatesByRegionAssayClassificationDropdownOption.NAAT_ASSAY ]
  }, [ cleanedChosenDropdownOption ])

  const estimatesByRegionSelectedAssayClassification = useMemo(() => {
    return assayClassificationOptions.includes(_estimatesByRegionSelectedAssayClassification)
      ? _estimatesByRegionSelectedAssayClassification
      : assayClassificationOptions[0]
  }, [ _estimatesByRegionSelectedAssayClassification, assayClassificationOptions ]);

  const visualizationFootnote = useMemo(() => {
    if(
      cleanedChosenDropdownOption === EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE ||
      cleanedChosenDropdownOption === EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE
    ) {
      return numberOfNonTypenameFiltersApplied !== 0
        ? `Screening assays detect antibodies to MERS-CoV typically using recombinant spike and nucleocapsid proteins. Confirmatory assays detect neutralizing antibodies to MERS-CoV using live virus or pseudotyped particles and are recommended to confirm positive screening results. ${numberOfNonTypenameFiltersApplied} filter(s) have been applied to this visualization using the filters to the left.`
        // A little hack here. The visualizations have problems if you don't have placeholder text when you try to turn a filter on.
        // Basically, if you don't get why this is here, replace this with an empty string and go to the ESTIMATES_BY_REGION visualization
        // in MERSTracker and apply a filter. The footnote doesn't show up until you switch to a different variant of the visualization.
        // If you tried that with the empty string or undefined and it worked just fine feel free to get rid of this hack though.
        : 'Screening assays detect antibodies to MERS-CoV typically using recombinant spike and nucleocapsid proteins. Confirmatory assays detect neutralizing antibodies to MERS-CoV using live virus or pseudotyped particles and are recommended to confirm positive screening results.';
    }

    return numberOfNonTypenameFiltersApplied !== 0
      ? `${numberOfNonTypenameFiltersApplied} filter(s) have been applied to this visualization using the filters to the left.`
      // A little hack here. The visualizations have problems if you don't have placeholder text when you try to turn a filter on.
      // Basically, if you don't get why this is here, replace this with an empty string and go to the ESTIMATES_BY_REGION visualization
      // in MERSTracker and apply a filter. The footnote doesn't show up until you switch to a different variant of the visualization.
      // If you tried that with the empty string or undefined and it worked just fine feel free to get rid of this hack though.
      : ' ';
  }, [ numberOfNonTypenameFiltersApplied, cleanedChosenDropdownOption ])

  const { areNonCamelAnimalsIncluded } = useContext(MersFilterMetadataContext);

  const getDisplayNameForEstimatesByRegion: MersVisualizationInformation<
    string,
    EstimatesByRegionVariableOfInterestDropdownOption,
    string,
    EstimatesByRegionAssayClassificationDropdownOption,
    EstimatesByRegionRegionDropdownOption
  >['getDisplayName'] = useCallback(() => ({
    type: VisualizationDisplayNameType.WITH_QUADRUPLE_DROPDOWN,
    beforeAllDropdownsHeaderText: "",
    firstDropdownProps: {
      dropdownName: 'Variable of Interest Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Seroprevalence Estimates',
        options: [
          ...(availableDropdownOptionGroups.includes(EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE)
            ? [ EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE ]
            : []
          ),
          ...(availableDropdownOptionGroups.includes(EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE)
            ? [ EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE ]
            : []
          ),
        ]
      }, {
        groupHeader: 'Viral Prevalence Estimates',
        options: [
          ...(availableDropdownOptionGroups.includes(EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_VIRAL_PREVALENCE)
            ? [ EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_VIRAL_PREVALENCE ]
            : []
          ),
          ...(availableDropdownOptionGroups.includes(EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_VIRAL_PREVALENCE)
            ? [ EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_VIRAL_PREVALENCE ]
            : []
          ),
        ]
      }],
      chosenDropdownOption: cleanedChosenDropdownOption,
      dropdownOptionToLabelMap: {
        [EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE]: "Human Seroprevalence Estimates",
        [EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_SEROPREVALENCE]: areNonCamelAnimalsIncluded
          ? "Animal Seroprevalence Estimates"
          : "Camel Seroprevalence Estimates",
        [EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_VIRAL_PREVALENCE]: "Human Viral Prevalence Estimates",
        [EstimatesByRegionVariableOfInterestDropdownOption.ANIMAL_VIRAL_PREVALENCE]: areNonCamelAnimalsIncluded
          ? "Animal Viral Prevalence Estimates"
          : "Camel Viral Prevalence Estimates",
      },
      onDropdownOptionChange: (option) => {
        setEstimatesByRegionVariableOfInterest(option);
      }
    },
    betweenFirstAndSecondDropdownHeaderText: " For ",
    secondDropdownProps: {
      dropdownName: 'Sample Frame Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Sample Frame',
        options: availableSampleFrames
      }],
      chosenDropdownOption: estimatesByRegionSelectedAnimalSampleFrameOrMacroSampleFrame,
      dropdownOptionToLabelMap: mersMacroSampleFrameTypeToTextMap,
      onDropdownOptionChange: (option) => {
        setEstimatesByRegionSelectedAnimalSampleFrameOrMacroSampleFrame(option);
      }
    },
    betweenSecondAndThirdDropdownHeaderText: " Tested Using ",
    thirdDropdownProps: {
      dropdownName: 'Assay Classification Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Assay Classification',
        options: assayClassificationOptions
      }],
      chosenDropdownOption: estimatesByRegionSelectedAssayClassification,
      dropdownOptionToLabelMap: {
        [EstimatesByRegionAssayClassificationDropdownOption.SCREENING]: "Screening",
        [EstimatesByRegionAssayClassificationDropdownOption.CONFIRMATORY]: "Confirmatory",
        [EstimatesByRegionAssayClassificationDropdownOption.NAAT_ASSAY]: "NAAT",
      },
      onDropdownOptionChange: (option) => {
        setEstimatesByRegionSelectedAssayClassification(option);
      }
    },
    betweenThirdAndFourthDropdownHeaderText: " Assays And Grouped By ",
    fourthDropdownProps: {
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
        [EstimatesByRegionRegionDropdownOption.COUNTRY]: "Country or Area",
      },
      onDropdownOptionChange: (option) => {
        setEstimatesByRegionSelectedRegion(option);
      }
    },
    afterAllDropdownsHeaderText: " With 95% Confidence Intervals"
  }), [ cleanedChosenDropdownOption, setEstimatesByRegionVariableOfInterest, estimatesByRegionSelectedRegion, setEstimatesByRegionSelectedRegion, availableDropdownOptionGroups, estimatesByRegionSelectedAssayClassification, assayClassificationOptions, availableSampleFrames, estimatesByRegionSelectedAnimalSampleFrameOrMacroSampleFrame, areNonCamelAnimalsIncluded ])

  const renderVisualizationForEstimatesByRegion: MersVisualizationInformation<
    string,
    EstimatesByRegionVariableOfInterestDropdownOption,
    EstimatesByRegionRegionDropdownOption,
    string,
    string
  >['renderVisualization'] = useCallback(() => (
    <EstimatesByRegion
      humanMersSeroprevalenceEstimates={humanMersSeroprevalenceEstimates}
      animalMersSeroprevalenceEstimates={animalMersSeroprevalenceEstimates}
      humanMersViralEstimates={humanMersViralEstimates}
      animalMersViralEstimates={animalMersViralEstimates}
      barColoursForWhoRegions={barColoursForWhoRegions}
      barColoursForUnRegions={barColoursForUnRegions}
      selectedVariableOfInterest={cleanedChosenDropdownOption}
      selectedAnimalSampleFrameOrMacroSampleFrame={estimatesByRegionSelectedAnimalSampleFrameOrMacroSampleFrame}
      selectedRegion={estimatesByRegionSelectedRegion}
      selectedAssayClassification={estimatesByRegionSelectedAssayClassification}
      legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
    />
  ), [ humanMersSeroprevalenceEstimates, animalMersSeroprevalenceEstimates, humanMersViralEstimates, animalMersViralEstimates, cleanedChosenDropdownOption, estimatesByRegionSelectedRegion, barColoursForWhoRegions, barColoursForUnRegions, estimatesByRegionSelectedAssayClassification, estimatesByRegionSelectedAnimalSampleFrameOrMacroSampleFrame ]);

  const customizationModalConfigurationForEstimatesByRegion: MersVisualizationInformation<
    string,
    EstimatesByRegionVariableOfInterestDropdownOption,
    EstimatesByRegionRegionDropdownOption,
    string,
    string
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
          ...(([MersAssayClassification.CONFIRMATORY, MersAssayClassification.SCREENING] as const).map((assayClassification) => ({
            type: CustomizationSettingType.MULTI_SELECT_DROPDOWN as const,
            dropdownName: `Assays included in the "${mersAssayClassificationToTextMap[assayClassification]}" category`,
            heading: 'Selected Assays',
            options: allAssays,
            optionToLabelMap: {},
            selected: assayClassifications
              .find(({ classification }) => classification === assayClassification)?.assays ?? [],
            handleOnChange: (newAssays: string[]) => adjustAssayClassification({
              classification: assayClassification,
              assays: newAssays
            })
          }))),
          ...((
            cleanedChosenDropdownOption === EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_SEROPREVALENCE ||
            cleanedChosenDropdownOption === EstimatesByRegionVariableOfInterestDropdownOption.HUMAN_VIRAL_PREVALENCE
          )
            ? macroSampleFrames
              .filter((macroSampleFrame): macroSampleFrame is Omit<
                typeof macroSampleFrame, 'macroSampleFrame'
              > & {
                macroSampleFrame: (
                  MersMacroSampleFrameType.GENERAL_POPULATION |
                  MersMacroSampleFrameType.HIGH_RISK_HEALTHCARE_WORKERS |
                  MersMacroSampleFrameType.HIGH_RISK_CLINICAL_MONITORING |
                  MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS
                )
              } => (
                macroSampleFrame.macroSampleFrame === MersMacroSampleFrameType.GENERAL_POPULATION ||
                macroSampleFrame.macroSampleFrame === MersMacroSampleFrameType.HIGH_RISK_HEALTHCARE_WORKERS ||
                macroSampleFrame.macroSampleFrame === MersMacroSampleFrameType.HIGH_RISK_CLINICAL_MONITORING ||
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
          ...(estimatesByRegionSelectedRegion === EstimatesByRegionRegionDropdownOption.WHO_REGION ? Object.values(WhoRegion).map((whoRegion): ColourPickerCustomizationSettingProps => ({
            type: CustomizationSettingType.COLOUR_PICKER as const,
            colourPickerName: `Colour for ${whoRegion}`,
            chosenColour: barColoursForWhoRegions[whoRegion],
            setChosenColour: (newChosenColour) => setBarColoursForWhoRegions({
              ...barColoursForWhoRegions,
              [whoRegion]: newChosenColour
            })
          })) : []),
          ...(estimatesByRegionSelectedRegion === EstimatesByRegionRegionDropdownOption.UN_REGION ? Object.values(UnRegion).map((unRegion): ColourPickerCustomizationSettingProps => ({
            type: CustomizationSettingType.COLOUR_PICKER as const,
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
  }, [ barColoursForWhoRegions, setBarColoursForWhoRegions, barColoursForUnRegions, setBarColoursForUnRegions, estimatesByRegionSelectedRegion, adjustAssayClassification, allAssays, assayClassifications, adjustMacroSampleFrame, allHumanSampleFrames, cleanedChosenDropdownOption, macroSampleFrames ]);

  const estimatesByRegionTitleTooltipContent: MersVisualizationInformation<
    string,
    EstimatesByRegionVariableOfInterestDropdownOption,
    EstimatesByRegionRegionDropdownOption,
    string,
    string
  >['titleTooltipContent'] = useMemo(() => {
    if(estimatesByRegionSelectedRegion === EstimatesByRegionRegionDropdownOption.WHO_REGION) {
      return (
        <WHORegionsTooltip>
          <ClopperPearsonConfidenceIntervalCalculationTooltip>
            <SampleSizeRestrictionTooltip />
          </ClopperPearsonConfidenceIntervalCalculationTooltip>
        </WHORegionsTooltip>
      );
    }

    if(estimatesByRegionSelectedRegion === EstimatesByRegionRegionDropdownOption.UN_REGION) {
      return (
        <UNRegionsTooltip>
          <ClopperPearsonConfidenceIntervalCalculationTooltip>
            <SampleSizeRestrictionTooltip />
          </ClopperPearsonConfidenceIntervalCalculationTooltip>
        </UNRegionsTooltip>
      );
    }

    if(estimatesByRegionSelectedRegion === EstimatesByRegionRegionDropdownOption.COUNTRY) {
      return (
        <ClopperPearsonConfidenceIntervalCalculationTooltip>
          <SampleSizeRestrictionTooltip />
        </ClopperPearsonConfidenceIntervalCalculationTooltip>
      );
    }

    assertNever(estimatesByRegionSelectedRegion);
  }, [ estimatesByRegionSelectedRegion ]);

  return {
    getDisplayNameForEstimatesByRegion,
    customizationModalConfigurationForEstimatesByRegion,
    renderVisualizationForEstimatesByRegion,
    estimatesByRegionTitleTooltipContent,
    visualizationFootnote
  }
}