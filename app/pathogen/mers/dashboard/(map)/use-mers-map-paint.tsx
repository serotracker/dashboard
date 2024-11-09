import { useContext, useMemo } from "react";
import { assertNever } from "assert-never";
import { useDataPointPresentLayer } from "@/components/ui/pathogen-map/country-highlight-layers/data-point-present-layer";
import { useTotalCamelPopulationLayer } from "./country-highlight-layers/total-camel-population-layer";
import { useCamelsPerCapitaLayer } from "./country-highlight-layers/camels-per-capita-layer";
import { useMersReportedHumanCasesMapLayer } from "./country-highlight-layers/mers-reported-human-cases-map-layer";
import { useMersReportedAnimalCasesMapLayer } from "./country-highlight-layers/mers-reported-animal-cases-map-layer";
import { GetCountryHighlightingLayerInformationOutput } from "@/components/ui/pathogen-map/pathogen-map";
import { CountryPaintChangeSetting, MersMapCountryHighlightingSettings } from "./use-mers-map-customization-modal";
import { AnimalMersEvent, HumanMersEvent, isAnimalMersEvent, isHumanMersEvent } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { MersDiagnosisStatus } from "@/gql/graphql";
import { CamelPopulationDataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/camel-population-data-context";
import { MapSymbology } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";
import { useMersWhoCaseData } from "@/hooks/mers/use-mers-who-case-data";
import { useMersWhoCasesMapLayer } from "./country-highlight-layers/mers-who-human-cases-map-layer";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";

interface UseMersMapPaintInput<
  TData extends {}
> {
  dataPoints: TData[];
  faoMersEventData: FaoMersEvent[];
  currentMapCountryHighlightingSettings: MersMapCountryHighlightingSettings;
  countryOutlinesSetting: CountryPaintChangeSetting;
  estimateDataShown: boolean;
  eventDataShown: boolean;
}

export const useMersMapPaint = <
  TData extends { countryAlphaThreeCode: string }
>(input: UseMersMapPaintInput<TData>) => {
  const { dataPoints, currentMapCountryHighlightingSettings, countryOutlinesSetting, faoMersEventData, estimateDataShown, eventDataShown } = input;

  const { latestFaoCamelPopulationDataPointsByCountry } = useContext(CamelPopulationDataContext);
  const { mersWhoCaseData } = useMersWhoCaseData();
  const dataPointPresentMapLayer = useDataPointPresentLayer();
  const totalCamelPopulationMapLayer = useTotalCamelPopulationLayer();
  const camelsPerCapitaMapLayer = useCamelsPerCapitaLayer();
  const reportedMersHumanCasesMapLayer = useMersReportedHumanCasesMapLayer();
  const reportedMersAnimalCasesMapLayer = useMersReportedAnimalCasesMapLayer();
  const mersWhoHumanCasesMapLayer = useMersWhoCasesMapLayer();

  const { paint, countryHighlightLayerLegendEntries, freeTextEntries, linearLegendColourGradientConfiguration } = useMemo((): GetCountryHighlightingLayerInformationOutput => {
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES) {
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      const { paint, freeTextEntries, linearLegendColourGradientConfiguration } = dataPointPresentMapLayer.getCountryHighlightingLayerInformation({
        data: dataPoints,
        countryHighlightingEnabled: true,
        countryOutlinesEnabled
      });

      let countryHighlightLayerLegendEntries: Array<{description: string, colour: string}> = [];

      if(estimateDataShown && eventDataShown) {
        countryHighlightLayerLegendEntries = [{
          description: 'Reported Events or Estimates Present',
          colour: MapSymbology.CountryFeature.HasData.Color
        }, {
          description: 'No Reported Events or Estimates Present',
          colour: MapSymbology.CountryFeature.Default.Color
        }]
      } else if(estimateDataShown) {
        countryHighlightLayerLegendEntries = [{
          description: 'Estimates Present',
          colour: MapSymbology.CountryFeature.HasData.Color
        }, {
          description: 'No Estimates Present',
          colour: MapSymbology.CountryFeature.Default.Color
        }]
      } else if(eventDataShown) {
        countryHighlightLayerLegendEntries = [{
          description: 'Reported Events Present',
          colour: MapSymbology.CountryFeature.HasData.Color
        }, {
          description: 'No Reported Events Present',
          colour: MapSymbology.CountryFeature.Default.Color
        }]
      }

      return {
        paint,
        linearLegendColourGradientConfiguration,
        countryHighlightLayerLegendEntries,
        freeTextEntries
      }
    }
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.TOTAL_CAMEL_POPULATION) {
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      return totalCamelPopulationMapLayer.getCountryHighlightingLayerInformation({
        data: latestFaoCamelPopulationDataPointsByCountry ?? [],
        countryOutlineData: dataPoints,
        countryOutlinesEnabled
      });
    }
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.CAMELS_PER_CAPITA) {
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      return camelsPerCapitaMapLayer.getCountryHighlightingLayerInformation({
        data: latestFaoCamelPopulationDataPointsByCountry ?? [],
        countryOutlineData: dataPoints,
        countryOutlinesEnabled
      });
    }
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.MERS_HUMAN_CASES) {
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      return reportedMersHumanCasesMapLayer.getCountryHighlightingLayerInformation({
        data: faoMersEventData
          .filter((dataPoint) => dataPoint.diagnosisStatus === MersDiagnosisStatus.Confirmed)
          .filter((dataPoint): dataPoint is HumanMersEvent => isHumanMersEvent(dataPoint))
          .map((dataPoint) => ({ humansAffected: dataPoint.humansAffected, countryAlphaThreeCode: dataPoint.country.alphaThreeCode })),
        countryOutlineData: dataPoints,
        countryOutlinesEnabled
      });
    }
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.MERS_ANIMAL_CASES) {
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      return reportedMersAnimalCasesMapLayer.getCountryHighlightingLayerInformation({
        data: faoMersEventData
          .filter((dataPoint) => dataPoint.diagnosisStatus === MersDiagnosisStatus.Confirmed)
          .filter((dataPoint): dataPoint is AnimalMersEvent => isAnimalMersEvent(dataPoint))
          .map((dataPoint) => ({ animalsAffected: 1, countryAlphaThreeCode: dataPoint.country.alphaThreeCode })),
        countryOutlineData: dataPoints,
        countryOutlinesEnabled
      });
    }
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.MERS_WHO_HUMAN_CASES) {
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      return mersWhoHumanCasesMapLayer.getCountryHighlightingLayerInformation({
        data: mersWhoCaseData?.map((dataPoint) => ({
          positiveCasesReported: dataPoint.positiveCasesReported,
          countryAlphaThreeCode: dataPoint.country.alphaThreeCode,
        })) ?? [],
        countryOutlineData: dataPoints,
        countryOutlinesEnabled
      });
    }
    assertNever(currentMapCountryHighlightingSettings);
  }, [ dataPointPresentMapLayer, totalCamelPopulationMapLayer, camelsPerCapitaMapLayer, currentMapCountryHighlightingSettings, dataPoints, latestFaoCamelPopulationDataPointsByCountry, countryOutlinesSetting, faoMersEventData, reportedMersHumanCasesMapLayer, estimateDataShown, eventDataShown, reportedMersAnimalCasesMapLayer, mersWhoCaseData, mersWhoHumanCasesMapLayer ]);

  return {
    paint,
    countryHighlightLayerLegendEntries,
    freeTextEntries,
    linearLegendColourGradientConfiguration
  }
};