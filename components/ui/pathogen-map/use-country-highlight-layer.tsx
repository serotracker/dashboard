import { CountryDataContextType } from "@/contexts/pathogen-context/country-information-context";
import { PathogenDataPointPropertiesBase } from "./pathogen-map";
import { VisiblePopupInfo } from "./pathogen-map-popup";
import { getBoundingBoxCenter, getBoundingBoxFromCountryAlphaTwoCode } from "@/lib/bounding-boxes";

interface SetPopUpInfoForCountryHighlightLayerInput<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> {
  newPopUpInfo: VisiblePopupInfo<TPathogenDataPointProperties>;
  setPopUpInfo: (input: VisiblePopupInfo<TPathogenDataPointProperties>) => void;
  dataPoints: (TPathogenDataPointProperties & { country: string, countryAlphaThreeCode: string, countryAlphaTwoCode: string })[];
  allowCountryPopUpsWithEmptyData: boolean;
  countryDataContext: CountryDataContextType;
}

export const useCountryHighlightLayer = () => {
  const setPopUpInfoForCountryHighlightLayer = <TPathogenDataPointProperties extends PathogenDataPointPropertiesBase>(
    input: SetPopUpInfoForCountryHighlightLayerInput<TPathogenDataPointProperties>,
  ) => {
    let alpha3CountryCode = undefined;

    if('CODE' in input.newPopUpInfo.properties && !!input.newPopUpInfo.properties.CODE && typeof input.newPopUpInfo.properties.CODE === 'string') {
      alpha3CountryCode = input.newPopUpInfo.properties['CODE'];
    }
    if('iso_3166_1_alpha_3' in input.newPopUpInfo.properties && !!input.newPopUpInfo.properties.iso_3166_1_alpha_3 && typeof input.newPopUpInfo.properties.iso_3166_1_alpha_3 === 'string') {
      alpha3CountryCode = input.newPopUpInfo.properties['iso_3166_1_alpha_3'];
    }
    if(!!alpha3CountryCode) {
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

          input.setPopUpInfo({
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
            }
          });
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