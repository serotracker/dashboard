import { countryNameToIso31661Alpha3CodeMap, iso31661Alpha3CodeToCountryNameMap } from "@/lib/country-iso-3166-1-alpha-3-codes";
import { PathogenDataPointPropertiesBase } from "./pathogen-map";
import { PathogenMapLayerInfoWithCountryHighlighting } from "./pathogen-map-layer";
import { VisiblePopupInfo } from "./pathogen-map-popup";
import { getBoundingBoxCenter, getBoundingBoxFromCountryName } from "@/lib/bounding-boxes";

interface SetPopUpInfoForCountryHighlightLayerInput<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> {
  layerForCountryHighlighting: PathogenMapLayerInfoWithCountryHighlighting<TPathogenDataPointProperties> | undefined;
  newPopUpInfo: VisiblePopupInfo<TPathogenDataPointProperties>;
  setPopUpInfo: (input: VisiblePopupInfo<TPathogenDataPointProperties>) => void;
}

export const useCountryHighlightLayer = () => {
  const setPopUpInfoForCountryHighlightLayer = <TPathogenDataPointProperties extends PathogenDataPointPropertiesBase>(
    input: SetPopUpInfoForCountryHighlightLayerInput<TPathogenDataPointProperties>
  ) => {
    if(!input.layerForCountryHighlighting) {
      return;
    }

    if('CODE' in input.newPopUpInfo.properties && !!input.newPopUpInfo.properties.CODE && typeof input.newPopUpInfo.properties.CODE === 'string') {
      const alpha3CountryCode = input.newPopUpInfo.properties['CODE'];
      const countryName = iso31661Alpha3CodeToCountryNameMap[alpha3CountryCode];
      const countryBoundingBox = getBoundingBoxFromCountryName(countryName);

      if(!countryBoundingBox) {
        return;
      }

      const dataForCountry = input.layerForCountryHighlighting.dataPoints
        .map((dataPoint) => ({...dataPoint, alpha3CountryCode: countryNameToIso31661Alpha3CodeMap[dataPoint.country]}))
        .filter((dataPoint) => dataPoint.alpha3CountryCode === alpha3CountryCode);

      if(dataForCountry.length === 0) {
        return;
      }

      const countryBoundingBoxCenter = getBoundingBoxCenter(countryBoundingBox);

      const popUpDataWithCountryInformation = {
        layerId: input.newPopUpInfo.layerId,
        visible: input.newPopUpInfo.visible,
        properties: {
          ...input.newPopUpInfo.properties,
          id: alpha3CountryCode,
          alpha3CountryCode,
          countryName: iso31661Alpha3CodeToCountryNameMap[alpha3CountryCode],
          latitude: countryBoundingBoxCenter.latitude,
          longitude: countryBoundingBoxCenter.longitude,
          dataPoints: dataForCountry
        }
      }

      input.setPopUpInfo(popUpDataWithCountryInformation);
    }
  }

  return {
    setPopUpInfoForCountryHighlightLayer
  }
}