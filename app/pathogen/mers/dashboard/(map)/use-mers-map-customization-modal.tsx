import { useContext, useMemo, useState } from "react";
import { ModalState, ModalType, UseModalInput, useModal } from "@/components/ui/modal/modal";
import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";
import { MapCustomizeButton } from "@/components/ui/pathogen-map/map-customize-button";
import { MersMapCustomizationsContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/map-customizations-context";
import Link from "next/link";

export enum CountryPaintChangeSetting {
  WHEN_RECOMMENDED = "WHEN_RECOMMENDED",
  ALWAYS_ENABLED = "ALWAYS_ENABLED",
  ALWAYS_DISABLED = "ALWAYS_DISABLED",
}

export enum MapDataPointVisibilityOptions {
  ESTIMATES_ONLY = 'ESTIMATES_ONLY',
  EVENTS_ONLY = 'EVENTS_ONLY',
  EVENTS_AND_ESTIMATES_VISIBLE = 'EVENTS_AND_ESTIMATES_VISIBLE',
  NOTHING_VISIBLE = 'NOTHING_VISIBLE',
}

const isMapDataPointVisibilityOptions = (input: string): input is MapDataPointVisibilityOptions =>
  Object.values(MapDataPointVisibilityOptions).some((element) => element === input);

const isCountryPaintChangeSetting = (input: string): input is CountryPaintChangeSetting =>
  Object.values(CountryPaintChangeSetting).some((element) => element === input);

export enum MersMapCountryHighlightingSettings {
  EVENTS_AND_ESTIMATES = 'EVENTS_AND_ESTIMATES',
  TOTAL_CAMEL_POPULATION = 'TOTAL_CAMEL_POPULATION',
  CAMELS_PER_CAPITA = 'CAMELS_PER_CAPITA',
  MERS_HUMAN_CASES = 'MERS_HUMAN_CASES',
  MERS_ANIMAL_CASES = 'MERS_ANIMAL_CASES',
  MERS_WHO_HUMAN_CASES = 'MERS_WHO_HUMAN_CASES'
}

const isMersMapCountryHighlightingSettings = (input: string): input is MersMapCountryHighlightingSettings =>
  Object.values(MersMapCountryHighlightingSettings).some((element) => element === input);

export const eventsProvidedCourtesyOfFaoTooltipContent = (
  <>
    <p className="inline">MERS events are provided courtesy of the </p>
    <Link className='inline text-link' href='https://empres-i.apps.fao.org/' target="__blank" rel="noopener noreferrer">FAO&apos;s Empres-i dashboard</Link>
    <p> which collects MERS events as they are reported by national authorities.</p>
  </>
)

export const camelPopulationProvidedCourtesyOfFaoTooltipContent = (
  <>
    <p className="inline">Camel population data is provided courtesy of the </p>
    <Link className='inline text-link' href='https://empres-i.apps.fao.org/' target="__blank" rel="noopener noreferrer">FAO&apos;s Empres-i dashboard</Link>
    <p> which collects data on the population of various different livestock.</p>
  </>
)

const countryHighlightingSettingToTooltipContent = {
  [MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES]: undefined,
  [MersMapCountryHighlightingSettings.TOTAL_CAMEL_POPULATION]: camelPopulationProvidedCourtesyOfFaoTooltipContent,
  [MersMapCountryHighlightingSettings.CAMELS_PER_CAPITA]: camelPopulationProvidedCourtesyOfFaoTooltipContent,
  [MersMapCountryHighlightingSettings.MERS_HUMAN_CASES]: eventsProvidedCourtesyOfFaoTooltipContent,
  [MersMapCountryHighlightingSettings.MERS_ANIMAL_CASES]: eventsProvidedCourtesyOfFaoTooltipContent,
  [MersMapCountryHighlightingSettings.MERS_WHO_HUMAN_CASES]: undefined,
}

const mapDataPointVisibilityOptionToTooltipContent = {
  [MapDataPointVisibilityOptions.ESTIMATES_ONLY]: undefined,
  [MapDataPointVisibilityOptions.EVENTS_ONLY]: eventsProvidedCourtesyOfFaoTooltipContent,
  [MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE]: eventsProvidedCourtesyOfFaoTooltipContent,
  [MapDataPointVisibilityOptions.NOTHING_VISIBLE]: undefined,
}

export const useMersMapCustomizationModal = () => {
  const [
    countryOutlinesSetting,
    setCountryOutlinesSetting
  ] = useState<CountryPaintChangeSetting>(CountryPaintChangeSetting.WHEN_RECOMMENDED);
  const {
    mapDataPointVisibilitySetting,
    setMapDataPointVisibilitySetting,
    currentMapCountryHighlightingSettings,
    setCurrentMapCountryHighlightingSettings
  } = useContext(MersMapCustomizationsContext);
  const [countryPopUpEnabled, setCountryPopUpEnabled] = useState<boolean>(true);

  const dropdownOptionToLabelMap = useMemo(() => ({
    [MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES]: process.env.NEXT_PUBLIC_FAO_EVENT_DATA_ENABLED === 'true'
      ? 'Presence of MERS estimates or events'
      : 'Presence of MERS estimates',
    [MersMapCountryHighlightingSettings.TOTAL_CAMEL_POPULATION]: "Total camel population",
    [MersMapCountryHighlightingSettings.CAMELS_PER_CAPITA]: "Camels per capita",
    [MersMapCountryHighlightingSettings.MERS_HUMAN_CASES]: "MERS Human Cases",
    [MersMapCountryHighlightingSettings.MERS_ANIMAL_CASES]: "MERS Animal Cases",
    [MersMapCountryHighlightingSettings.MERS_WHO_HUMAN_CASES]: "MERS Human Cases",
    [CountryPaintChangeSetting.WHEN_RECOMMENDED]: "When Recommended",
    [CountryPaintChangeSetting.ALWAYS_ENABLED]: "Always Enabled",
    [CountryPaintChangeSetting.ALWAYS_DISABLED]: "Always Disabled",
    [MapDataPointVisibilityOptions.ESTIMATES_ONLY]: "Only Estimates Visible",
    [MapDataPointVisibilityOptions.EVENTS_ONLY]: "Only Events Visible",
    [MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE]: "Events And Estimates Visible",
    [MapDataPointVisibilityOptions.NOTHING_VISIBLE]: "No Data Visible on Map",
  }), [])


  const useModalInput: UseModalInput<MersMapCountryHighlightingSettings | CountryPaintChangeSetting | MapDataPointVisibilityOptions> = useMemo(() => ({
    initialModalState: ModalState.CLOSED,
    disabled: false,
    modalType: ModalType.CUSTOMIZATION_MODAL,
    content: {
      paginationHoverClassname: "hover:bg-mersHover",
      paginationSelectedClassname: "bg-mers",
      customizationSettings: [{
        type: CustomizationSettingType.DROPDOWN,
        dropdownName: 'Country Highlighting',
        borderColourClassname: 'border-mers',
        hoverColourClassname: 'hover:bg-mersHover/50',
        highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
        dropdownOptionGroups: [{
          groupHeader: 'Seroprevalence and Viral Prevalence Estimates',
          options: [
            MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES
          ]
        }, {
          groupHeader: 'Camels',
          options: [
            MersMapCountryHighlightingSettings.TOTAL_CAMEL_POPULATION,
            //MersMapCountryHighlightingSettings.CAMELS_PER_CAPITA,
          ]
        },
        ...(process.env.NEXT_PUBLIC_FAO_EVENT_DATA_ENABLED === 'true' ? [{
          groupHeader: 'Reported Positive Cases',
          options: [
            MersMapCountryHighlightingSettings.MERS_HUMAN_CASES,
            MersMapCountryHighlightingSettings.MERS_ANIMAL_CASES,
            MersMapCountryHighlightingSettings.MERS_WHO_HUMAN_CASES,
          ]
        }] : [{
          groupHeader: 'Reported Positive Cases',
          options: [
            MersMapCountryHighlightingSettings.MERS_WHO_HUMAN_CASES,
          ]
        }])
        ],
        chosenDropdownOption: currentMapCountryHighlightingSettings,
        dropdownOptionToLabelMap,
        onDropdownOptionChange: (option) => {
          if(isMersMapCountryHighlightingSettings(option)) {
            setCurrentMapCountryHighlightingSettings(option)
          }
        },
        tooltipContent: countryHighlightingSettingToTooltipContent[currentMapCountryHighlightingSettings]
      }, {
        type: CustomizationSettingType.DROPDOWN,
        dropdownName: 'Country outlines for countries with data',
        borderColourClassname: 'border-mers',
        hoverColourClassname: 'hover:bg-mersHover/50',
        highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
        dropdownOptionGroups: [{
          groupHeader: 'Preferences',
          options: [
            CountryPaintChangeSetting.WHEN_RECOMMENDED,
            CountryPaintChangeSetting.ALWAYS_DISABLED,
            CountryPaintChangeSetting.ALWAYS_ENABLED,
          ]
        }],
        chosenDropdownOption: countryOutlinesSetting,
        dropdownOptionToLabelMap,
        onDropdownOptionChange: (option) => {
          if(isCountryPaintChangeSetting(option)) {
            setCountryOutlinesSetting(option)
          }
        }
      },
      ...(process.env.NEXT_PUBLIC_FAO_EVENT_DATA_ENABLED ? [{
        type: CustomizationSettingType.DROPDOWN as const,
        dropdownName: 'Data point types shown on map',
        borderColourClassname: 'border-mers',
        hoverColourClassname: 'hover:bg-mersHover/50',
        highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
        dropdownOptionGroups: [{
          groupHeader: 'Data Points Shown',
          options: [
            MapDataPointVisibilityOptions.ESTIMATES_ONLY,
            // Potentially enable this at some future date, talking to the FAO and WHO folks they weren't a huge fan.
            // MapDataPointVisibilityOptions.EVENTS_ONLY,
            // MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE,
            MapDataPointVisibilityOptions.NOTHING_VISIBLE
          ]
        }],
        chosenDropdownOption: mapDataPointVisibilitySetting,
        dropdownOptionToLabelMap,
        onDropdownOptionChange: (option: string) => {
          if(isMapDataPointVisibilityOptions(option)) {
            setMapDataPointVisibilitySetting(option)
          }
        },
        tooltipContent: mapDataPointVisibilityOptionToTooltipContent[mapDataPointVisibilitySetting]
      }]: []),
      {
        type: CustomizationSettingType.SWITCH,
        switchName: `Country pop-up ${countryPopUpEnabled ? 'enabled' : 'disabled'}.`,
        switchValue: countryPopUpEnabled,
        onSwitchValueChange: (newSwitchValue) => setCountryPopUpEnabled(newSwitchValue),
      }]
    }
  }), [ countryOutlinesSetting, setCountryOutlinesSetting, currentMapCountryHighlightingSettings, setCurrentMapCountryHighlightingSettings, countryPopUpEnabled, setCountryPopUpEnabled, mapDataPointVisibilitySetting, setMapDataPointVisibilitySetting, dropdownOptionToLabelMap ]);

  const {
    modal: customizationModal,
    setModalState: setCustomizationModalState,
  } = useModal(useModalInput);

  const mapCustomizeButton = useMemo(() =>
    <MapCustomizeButton
      onClick={() => setCustomizationModalState(ModalState.OPENED)}
      hoverColourClassname='hover:bg-mersHover/50'
    />
  , [ setCustomizationModalState ])

  return {
    customizationModal,
    countryPopUpEnabled,
    currentMapCountryHighlightingSettings,
    countryOutlinesSetting,
    mapDataPointVisibilitySetting,
    mapCustomizeButton: () => mapCustomizeButton
  }
}