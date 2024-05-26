import { PathogenDataPointPropertiesBase } from "./pathogen-map";
import { VisiblePopupInfo } from "./pathogen-map-popup";
import { getBoundingBoxCenter, getBoundingBoxFromCountryAlphaTwoCode } from "@/lib/bounding-boxes";

interface SetPopUpInfoForCountryHighlightLayerInput<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> {
  newPopUpInfo: VisiblePopupInfo<TPathogenDataPointProperties>;
  setPopUpInfo: (input: VisiblePopupInfo<TPathogenDataPointProperties>) => void;
<<<<<<< HEAD
  dataPoints: (TPathogenDataPointProperties & { country: string, countryAlphaThreeCode: string, countryAlphaTwoCode: string })[];
=======
  dataPoints: (TPathogenDataPointProperties & { country: string, countryAlphaThreeCode: string })[];

>>>>>>> 2dc303cf6d03138ce8e7b4a6dbac3f6bb6e3d14e
}

export const useCountryHighlightLayer = () => {
  const setPopUpInfoForCountryHighlightLayer = <TPathogenDataPointProperties extends PathogenDataPointPropertiesBase>(
    input: SetPopUpInfoForCountryHighlightLayerInput<TPathogenDataPointProperties>,
  ) => {

    if('CODE' in input.newPopUpInfo.properties && !!input.newPopUpInfo.properties.CODE && typeof input.newPopUpInfo.properties.CODE === 'string') {
      const alpha3CountryCode = input.newPopUpInfo.properties['CODE'];
      const dataForCountry = input.dataPoints
        .filter((dataPoint) => dataPoint.countryAlphaThreeCode === alpha3CountryCode);

      if(dataForCountry.length === 0) {
        return;
      }

      const countryName = dataForCountry[0].country
<<<<<<< HEAD
      const countryAlphaTwoCode = dataForCountry[0].countryAlphaTwoCode

      const countryBoundingBox = getBoundingBoxFromCountryAlphaTwoCode(countryAlphaTwoCode);
=======

      const countryBoundingBox = getBoundingBoxFromCountryName(countryName);
>>>>>>> 2dc303cf6d03138ce8e7b4a6dbac3f6bb6e3d14e

      if(!countryBoundingBox) {
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
          countryName: countryName,
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