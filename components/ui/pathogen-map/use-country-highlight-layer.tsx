import { CountryDataContextType } from "@/contexts/pathogen-context/country-information-context";
import { PathogenDataPointPropertiesBase } from "./pathogen-map";
import { PopUpOnOpenMapEffectType, triggerPathogenMapPopupOnOpen, VisiblePopupInfo } from "./pathogen-map-popup";
import { getBoundingBoxCenter, getBoundingBoxFromCountryAlphaTwoCode } from "@/lib/bounding-boxes";
import { useMap } from "react-map-gl";

interface SetPopUpInfoForCountryHighlightLayerInput<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> {
  newPopUpInfo: VisiblePopupInfo<TPathogenDataPointProperties>;
  setPopUpInfo: (input: VisiblePopupInfo<TPathogenDataPointProperties>) => void;
  dataPoints: (TPathogenDataPointProperties & { country: string, countryAlphaThreeCode: string, countryAlphaTwoCode: string })[];
  allowCountryPopUpsWithEmptyData: boolean;
  countryDataContext: CountryDataContextType;
}

interface UseCountryHighlightLayerInput {
  mapId: string;
}

export const useCountryHighlightLayer = (hookInput: UseCountryHighlightLayerInput) => {
  const allMaps = useMap();

  const setPopUpInfoForCountryHighlightLayer = <TPathogenDataPointProperties extends PathogenDataPointPropertiesBase>(
    input: SetPopUpInfoForCountryHighlightLayerInput<TPathogenDataPointProperties>,
  ) => {

    if('CODE' in input.newPopUpInfo.properties && !!input.newPopUpInfo.properties.CODE && typeof input.newPopUpInfo.properties.CODE === 'string') {
      const alpha3CountryCode = input.newPopUpInfo.properties['CODE'];
      const dataForCountry = input.dataPoints
        .filter((dataPoint) => dataPoint.countryAlphaThreeCode === alpha3CountryCode);

      if(dataForCountry.length === 0) {
        if(input.allowCountryPopUpsWithEmptyData) {
          const country = input.countryDataContext
            .find((element) => element.countryAlphaThreeCode === alpha3CountryCode);

          if(!country) {
            return;
          }

          const countryBoundingBox = getBoundingBoxFromCountryAlphaTwoCode(country.countryAlphaTwoCode);

          if(!countryBoundingBox) {
            return;
          }

          const countryBoundingBoxCenter = getBoundingBoxCenter(countryBoundingBox);

          const onOpenEffect = input.newPopUpInfo.onOpenEffect.type === PopUpOnOpenMapEffectType.BOUNDING_BOX_ZOOM ? {
            type: PopUpOnOpenMapEffectType.BOUNDING_BOX_ZOOM as const,
            boundingBox: {
              longitudeMinimum: countryBoundingBox[0],
              latitudeMinimum: countryBoundingBox[1],
              longitudeMaximum: countryBoundingBox[2],
              latitudeMaximum: countryBoundingBox[3]
            }
          } : input.newPopUpInfo.onOpenEffect

          const map = allMaps[hookInput.mapId];

          const popUpInfo = {
            layerId: input.newPopUpInfo.layerId,
            visible: input.newPopUpInfo.visible,
            properties: {
              ...input.newPopUpInfo.properties,
              id: alpha3CountryCode,
              alpha3CountryCode,
              countryName: country.countryName,
              latitude: countryBoundingBoxCenter.latitude,
              longitude: countryBoundingBoxCenter.longitude,
              dataPoints: []
            },
            onOpenEffect,
          }

          triggerPathogenMapPopupOnOpen({
            map,
            popUpInfo,
            latitude: countryBoundingBoxCenter.latitude,
            longitude: countryBoundingBoxCenter.longitude,
          })

          input.setPopUpInfo(popUpInfo);
        }

        return;
      }

      const countryName = dataForCountry[0].country
      const countryAlphaTwoCode = dataForCountry[0].countryAlphaTwoCode

      const countryBoundingBox = getBoundingBoxFromCountryAlphaTwoCode(countryAlphaTwoCode);

      if(!countryBoundingBox) {
        return;
      }

      const countryBoundingBoxCenter = getBoundingBoxCenter(countryBoundingBox);

      const onOpenEffect = input.newPopUpInfo.onOpenEffect.type === PopUpOnOpenMapEffectType.BOUNDING_BOX_ZOOM ? {
        type: PopUpOnOpenMapEffectType.BOUNDING_BOX_ZOOM as const,
        boundingBox: {
          longitudeMinimum: countryBoundingBox[0],
          latitudeMinimum: countryBoundingBox[1],
          longitudeMaximum: countryBoundingBox[2],
          latitudeMaximum: countryBoundingBox[3]
        }
      } : input.newPopUpInfo.onOpenEffect

      const map = allMaps[hookInput.mapId];

      const popUpInfo = {
        layerId: input.newPopUpInfo.layerId,
        visible: input.newPopUpInfo.visible,
        properties: {
          ...input.newPopUpInfo.properties,
          id: alpha3CountryCode,
          alpha3CountryCode,
          countryName: countryName,
          latitude: countryBoundingBoxCenter.latitude,
          longitude: countryBoundingBoxCenter.longitude,
          dataPoints: dataForCountry
        },
        onOpenEffect,
      }

      console.log('map', map)
      console.log('popUpInfo', popUpInfo)
      console.log('popUpInfo.onOpenEffect', popUpInfo.onOpenEffect)
      console.log('latitude', countryBoundingBoxCenter.latitude)
      console.log('longitude', countryBoundingBoxCenter.longitude)


      triggerPathogenMapPopupOnOpen({
        map,
        popUpInfo,
        latitude: countryBoundingBoxCenter.latitude,
        longitude: countryBoundingBoxCenter.longitude,
      })

      input.setPopUpInfo(popUpInfo);
    }
  }

  return {
    setPopUpInfoForCountryHighlightLayer
  }
}