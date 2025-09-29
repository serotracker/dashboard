/**
 * @file ArbovirusMap Component
 * @description This component renders a Map for the Arboviruses dashboard.
 * It includes checkboxes for different pathogens and a side panel with additional filters.
 * The map and filters are dynamically updated based on user interactions.
 */

"use client";

import React, { useContext, useMemo, useState } from "react";
import { useGroupedArboData } from "@/hooks/arbovirus/useGroupedArboData";
import { ArbovirusEstimatePopupContent } from "./arbovirus-estimate-pop-up-content";
import { PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";
import { MapArbovirusStudySubmissionPrompt } from "./MapArbovirusStudySubmissionPrompt";
import { ArboCountryPopupContent, SelectedArbovirusEnvironmentalSuitabilityMap } from "./arbo-country-pop-up-content";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { MapEstimateSummary } from "@/components/ui/pathogen-map/map-estimate-summary";
import { isPopupCountryHighlightLayerContentGeneratorInput } from "@/components/ui/pathogen-map/pathogen-map-popup";
import { Arbovirus } from "@/gql/graphql";
import { GenericMapPopUpWidth } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { useDataPointPresentLayer } from "@/components/ui/pathogen-map/country-highlight-layers/data-point-present-layer";
import { CountryHighlightLayerLegend } from "@/components/ui/pathogen-map/country-highlight-layers/country-highlight-layer-legend";
import { useEsmCountryHighlightLayer } from "./country-highlight-layers/esm-country-highlight-layer";
import { CountryPaintChangeSetting, useArbovirusMapCustomizationModal } from "./use-arbovirus-map-customization-modal";
import { ArbovirusEnvironmentalSuitabilityCountryDataContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-environmental-suitability-country-data-context";
import { CountryDataContext } from "@/contexts/pathogen-context/country-information-context";
import { ArbovirusOropoucheCasesDataContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-oropouche-cases-data-context";
import { Layer, Source } from "react-map-gl";
import { mapColourBucketsToLinearGradientConfiguration } from "@/components/ui/pathogen-map/country-highlight-layers/map-colour-buckets-to-linear-gradient-configuration";
import { useGroupedArbovirusEstimateData } from "../../use-arbo-primary-estimate-data";
import { MapSectionComponentProps } from "@/app/pathogen/generic-pathogen-dashboard-page";
import { DashboardType, dashboardTypeToMapIdMap } from "@/app/pathogen/dashboard-enums";
import { MapDownloadButton } from "@/components/ui/pathogen-map/map-download-button";
import { MapSymbology } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";

// TODO: Needs to be synced with tailwind pathogen colors. How?
export const pathogenColors: Record<Arbovirus, string> = {
  [Arbovirus.Zikv]: "#a0c4ff",
  [Arbovirus.Chikv]: "#9bf6ff",
  [Arbovirus.Wnv]: "#caffbf",
  [Arbovirus.Denv]: "#ffadad",
  [Arbovirus.Yfv]: "#ffd6a5",
  [Arbovirus.Mayv]: "#c5a3ff",
  [Arbovirus.Orov]: "#ffc8dd"
};

const esmValueToSelectedEsm: Record<string, SelectedArbovirusEnvironmentalSuitabilityMap | undefined> = {
  'dengue2015': SelectedArbovirusEnvironmentalSuitabilityMap.DENGUE_2015,
  'dengue2050': SelectedArbovirusEnvironmentalSuitabilityMap.DENGUE_2050,
  'zika': SelectedArbovirusEnvironmentalSuitabilityMap.ZIKA
}

export const ArbovirusMap = (props: MapSectionComponentProps) => {
  const [ isStudySubmissionPromptVisible, setStudySubmissionPromptVisibility ] = useState(true);
  const countryDataContext = useContext(CountryDataContext);
  const { selectedFilters } = useContext(ArboContext);
  const { filteredData: filteredDataRaw } = useGroupedArbovirusEstimateData().primaryEstimateData;
  const { oropoucheCaseMapboxLayer, oropoucheCaseLayerColourBuckets } = useContext(ArbovirusOropoucheCasesDataContext);
  const { arbovirusEnvironmentalSuitabilityCountryData } = useContext(ArbovirusEnvironmentalSuitabilityCountryDataContext);
  const { data: groupedArboData } = useGroupedArboData();
  const { getCountryHighlightingLayerInformation: getDataPointPresentCountryHighlightingLayerInformation } = useDataPointPresentLayer();
  const { getCountryHighlightingLayerInformation: getESMCountryHighlightingLayerInformation } = useEsmCountryHighlightLayer();
  const {
    countryHighlightingSetting,
    countryOutlinesSetting,
    countryPopUpEnabled,
    ...arbovirusMapCustomizationModal
  } = useArbovirusMapCustomizationModal();

  const data = useMemo(() => {
    return groupedArboData?.arbovirusEstimates?.filter((dataPoint) => !!dataPoint.isPrimaryEstimate) ?? undefined;
  }, [ groupedArboData ]);

  const filteredData = useMemo(() => {
    return filteredDataRaw.filter((estimate) => !!estimate.isPrimaryEstimate) ?? undefined;
  }, [ filteredDataRaw ]);

  const oropoucheCasesMapEnabled = useMemo(() => {
    if(selectedFilters.positiveCases?.length > 0) {
      return true;
    }

    return false;
  }, [ selectedFilters ]);

  const { paint, countryHighlightLayerLegendEntries, freeTextEntries, linearLegendColourGradientConfiguration, legendTooltipContent } = useMemo(() => {
    if(selectedFilters.positiveCases?.length > 0) {
      const countryHighlightingEnabled = (countryHighlightingSetting === CountryPaintChangeSetting.ALWAYS_ENABLED);
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      const {
        paint,
        countryHighlightLayerLegendEntries,
        freeTextEntries
      } = getDataPointPresentCountryHighlightingLayerInformation({
        data: filteredData,
        countryHighlightingEnabled,
        countryOutlinesEnabled
      });

      const { linearLegendColourGradientConfiguration } = mapColourBucketsToLinearGradientConfiguration({
        mapColourBuckets: oropoucheCaseLayerColourBuckets,
        minimumPossibleValue: 0
      })

      return {
        paint,
        countryHighlightLayerLegendEntries,
        freeTextEntries,
        linearLegendColourGradientConfiguration: {
          enabled: linearLegendColourGradientConfiguration.enabled,
          props: {
            ticks: linearLegendColourGradientConfiguration.props.ticks,
            title: 'Postive Cases Reported'
          }
        },
        legendTooltipContent: undefined
      }
    }
    if(selectedFilters.esm?.length > 0) {
      const countryHighlightingEnabled = (countryHighlightingSetting === CountryPaintChangeSetting.ALWAYS_ENABLED);
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      return getESMCountryHighlightingLayerInformation({
        data: filteredData,
        countryHighlightingEnabled,
        countryOutlinesEnabled
      })
    }

    const countryHighlightingEnabled = (countryHighlightingSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryHighlightingSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);
    const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

    return getDataPointPresentCountryHighlightingLayerInformation({
      data: filteredData,
      countryHighlightingEnabled,
      countryOutlinesEnabled
    })
  }, [ filteredData, getDataPointPresentCountryHighlightingLayerInformation, getESMCountryHighlightingLayerInformation, selectedFilters, countryHighlightingSetting, countryOutlinesSetting, oropoucheCaseLayerColourBuckets ]);

  const legendEntries = useMemo(() => [
    ...countryHighlightLayerLegendEntries,
    ...((selectedFilters.esm?.length > 0 && countryHighlightLayerLegendEntries.length === 0) ? [{ colour: "#FFFFFF", description: "Unsuitable Environment"}] : []),
    ...(selectedFilters.esm?.length > 0 ? [{ colour: "rgba(54,2,4,0.5)", description: "Suitable Environment"}] : []),
    ...(selectedFilters.esm?.length > 0 ? [{ colour: MapSymbology.CountryFeature.Default.Color, description: "Not applicable"}] : []),
  ], [countryHighlightLayerLegendEntries, selectedFilters]);

  const selectedEsm = useMemo(() => {
    const isEsmMapSelected = selectedFilters.esm?.length === 1;

    if(!isEsmMapSelected) {
      return SelectedArbovirusEnvironmentalSuitabilityMap.NO_ESM_SELECTED;
    }

    const selectedEsmFilter = selectedFilters.esm[0];

    return esmValueToSelectedEsm[selectedEsmFilter] ?? SelectedArbovirusEnvironmentalSuitabilityMap.NO_ESM_SELECTED;
  }, [ selectedFilters ]);

  if (!data) {
    return <span> Loading... </span>;
  }

  return (
    <>
      <div className={"w-full h-full p-0"}>
        <PathogenMap
          id={dashboardTypeToMapIdMap[DashboardType.ARBOVIRUS]}
          countryHighlightingEnabled={true}
          allowCountryPopUpsWithEmptyData={selectedEsm !== SelectedArbovirusEnvironmentalSuitabilityMap.NO_ESM_SELECTED}
          countryDataContext={countryDataContext}
          countryPopUpEnabled={countryPopUpEnabled}
          countryPopUpOnHoverEnabled={false}
          baseCursor=""
          sourceId="arbo-[GENERATED-SOURCE-ID]"
          layers={[
            {
              id: "Arbovirus-pins",
              type: "circle",
              isDataUsedForCountryHighlighting: true,
              cursor: "pointer",
              filter: ["!", ["has", "point_count"]],
              layerPaint: {
                "circle-color": [
                  "match",
                  ["get", "pathogen"],
                  "ZIKV",
                  "#A0C4FF",
                  "CHIKV",
                  "#9BF6FF",
                  "WNV",
                  "#CAFFBF",
                  "DENV",
                  "#FFADAD",
                  "YFV",
                  "#FFD6A5",
                  "MAYV",
                  "#C5A3FF",
                  "OROV",
                  "#FFC8DD",
                  "#FFFFFC",
                ],
                "circle-radius": 8,
                "circle-stroke-color": "#333333",
                "circle-stroke-width": 1,
              },
            },
          ]}
          generatePopupContent={(input) => {
            if(isPopupCountryHighlightLayerContentGeneratorInput(input)) {
              return <ArboCountryPopupContent
                arbovirusEnvironmentalSuitabilityCountryData={arbovirusEnvironmentalSuitabilityCountryData}
                selectedEsm={selectedEsm}
                record={input.data}
              />
            }
          
            return <ArbovirusEstimatePopupContent estimate={input.data} />
          }}
          dataPoints={filteredData}
          clusteringSettings={{
            clusteringEnabled: true,
            clusteringRadius: 80,
            headerText: "Estimate Count",
            popUpWidth: GenericMapPopUpWidth.AUTO,
            clusterProperties: {
              [Arbovirus.Zikv]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Zikv], 1, 0]],
              [Arbovirus.Chikv]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Chikv], 1, 0]],
              [Arbovirus.Wnv]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Wnv], 1, 0]],
              [Arbovirus.Denv]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Denv], 1, 0]],
              [Arbovirus.Yfv]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Yfv], 1, 0]],
              [Arbovirus.Mayv]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Mayv], 1, 0]],
              [Arbovirus.Orov]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Orov], 1, 0]],
            },
            validClusterPropertyKeys: Object.values(Arbovirus),
            clusterPropertyKeysIncludedInSum: Object.values(Arbovirus),
            clusterPropertyToColourMap: pathogenColors
          }}
          additionalLayers={oropoucheCasesMapEnabled ? oropoucheCaseMapboxLayer : null}
          paint={paint}
        />
      </div>
      <MapArbovirusStudySubmissionPrompt 
        hidden={!isStudySubmissionPromptVisible}
        onClose={() => setStudySubmissionPromptVisibility(false)}
        className={"absolute bottom-1 left-1 mx-auto w-1/2 text-center bg-white/60 backdrop-blur-md"}
      />
      <CountryHighlightLayerLegend
        className={"absolute bottom-1 right-1 mb-1 bg-white/60 backdrop-blur-md"}
        legendEntries={legendEntries}
        freeTextEntries={freeTextEntries}
        linearLegendColourGradientConfiguration={linearLegendColourGradientConfiguration}
        closeButtonConfiguration={{ enabled: false }}
        legendTooltipContent={legendTooltipContent}
      />
      <MapEstimateSummary filteredData={filteredData}/>
      <arbovirusMapCustomizationModal.mapCustomizeButton />
      <arbovirusMapCustomizationModal.customizationModal />
      <MapDownloadButton
        dashboardType={DashboardType.ARBOVIRUS}
      />
    </>
  );
}
