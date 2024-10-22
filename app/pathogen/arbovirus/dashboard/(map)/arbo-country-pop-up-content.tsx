import { Arbovirus } from "@/gql/graphql";
import { ArbovirusEnvironmentalSuitabilityCountryDataContextType } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-environmental-suitability-country-data-context";
import { Dengue2015EsmArboCountryPopupContent } from "./arbo-country-pop-up-content/dengue-2015-esm-arbo-country-pop-up-content";
import { Dengue2050EsmArboCountryPopupContent } from "./arbo-country-pop-up-content/dengue-2050-esm-arbo-country-pop-up-content";
import { ZikaEsmArboCountryPopupContent } from "./arbo-country-pop-up-content/zika-esm-arbo-country-pop-up-content";
import { StandardArboCountryPopupContent } from "./arbo-country-pop-up-content/standard-arbo-country-pop-up-content";

export enum SelectedArbovirusEnvironmentalSuitabilityMap {
  NO_ESM_SELECTED = "NO_ESM_SELECTED",
  ZIKA = "ZIKA",
  DENGUE_2015 = "DENGUE_2015",
  DENGUE_2050 = "DENGUE_2050",
}

export interface ArboCountryPopupContentProps {
  record: {
    id: string,
    alpha3CountryCode: string,
    countryName: string,
    latitude: string,
    longitude: string,
    dataPoints: { pathogen: Arbovirus }[],
  }
  arbovirusEnvironmentalSuitabilityCountryData:
    ArbovirusEnvironmentalSuitabilityCountryDataContextType['arbovirusEnvironmentalSuitabilityCountryData'],
  selectedEsm: SelectedArbovirusEnvironmentalSuitabilityMap
}

export const arbovirusToRibbonColourClassname: Record<Arbovirus, string> = {
  [Arbovirus.Zikv]: 'bg-zikv',
  [Arbovirus.Denv]: 'bg-denv',
  [Arbovirus.Chikv]: 'bg-chikv',
  [Arbovirus.Yfv]: 'bg-yfv',
  [Arbovirus.Wnv]: 'bg-wnv',
  [Arbovirus.Mayv]: 'bg-mayv',
  [Arbovirus.Orov]: 'bg-orov',
}

export const ArboCountryPopupContent = (input: ArboCountryPopupContentProps): React.ReactNode => {
  const { record, arbovirusEnvironmentalSuitabilityCountryData, selectedEsm } = input;

  return (
    <>
      <Dengue2015EsmArboCountryPopupContent
        record={record}
        arbovirusEnvironmentalSuitabilityCountryData={arbovirusEnvironmentalSuitabilityCountryData}
        hidden={selectedEsm !== SelectedArbovirusEnvironmentalSuitabilityMap.DENGUE_2015}
      />
      <Dengue2050EsmArboCountryPopupContent
        record={record}
        arbovirusEnvironmentalSuitabilityCountryData={arbovirusEnvironmentalSuitabilityCountryData}
        hidden={selectedEsm !== SelectedArbovirusEnvironmentalSuitabilityMap.DENGUE_2050}
      />
      <ZikaEsmArboCountryPopupContent
        record={record}
        arbovirusEnvironmentalSuitabilityCountryData={arbovirusEnvironmentalSuitabilityCountryData}
        hidden={selectedEsm !== SelectedArbovirusEnvironmentalSuitabilityMap.ZIKA}
      />
      <StandardArboCountryPopupContent
        record={record}
        hidden={selectedEsm !== SelectedArbovirusEnvironmentalSuitabilityMap.NO_ESM_SELECTED}
      />
    </>
  );
}