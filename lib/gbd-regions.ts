import { GbdSubRegion, GbdSuperRegion } from "@/gql/graphql";

export const gbdSuperRegionToLabelMap = {
  [GbdSuperRegion.CentralEuropeEasternEuropeAndCentralAsia]: "Central Europe, Eastern Europe & Central Asia",
  [GbdSuperRegion.HighIncome]: "High Income",
  [GbdSuperRegion.LatinAmericaAndCaribbean]: "Latin America & Caribbean",
  [GbdSuperRegion.NorthAfricaAndMiddleEast]: "North Africa & Middle East",
  [GbdSuperRegion.SouthAsia]: "South-East Asia, East Asia & Oceania",
  [GbdSuperRegion.SouthEastAsiaEastAsiaAndOceania]: "South-East Asia, East Asia & Oceania",
  [GbdSuperRegion.SubSaharanAfrica]: "Sub-saharan Africa"
};

export const gbdSubRegionToLabelMap = {
  [GbdSubRegion.CentralEuropeEasternEuropeAndCentralAsiaSubregionCentralAsia]: "Central Asia",
  [GbdSubRegion.CentralEuropeEasternEuropeAndCentralAsiaSubregionCentralEurope]: "Central Europe",
  [GbdSubRegion.CentralEuropeEasternEuropeAndCentralAsiaSubregionEasternEurope]: "Eastern Europe",
  [GbdSubRegion.HighIncomeSubregionAsiaPacific]: "High-income Asia Pacific",
  [GbdSubRegion.HighIncomeSubregionAustralasia]: "Australasia",
  [GbdSubRegion.HighIncomeSubregionNorthAmerica]: "High-income North America",
  [GbdSubRegion.HighIncomeSubregionSouthernLatinAmerica]: "Southern Latin America",
  [GbdSubRegion.HighIncomeSubregionWesternEurope]: "Western Europe",
  [GbdSubRegion.LatinAmericaAndCaribbeanSubregionAndean]: "Andean Latin America",
  [GbdSubRegion.LatinAmericaAndCaribbeanSubregionCaribbean]: "Caribbean",
  [GbdSubRegion.LatinAmericaAndCaribbeanSubregionCentral]: "Central Latin America",
  [GbdSubRegion.LatinAmericaAndCaribbeanSubregionTropical]: "Tropical Latin America",
  [GbdSubRegion.NorthAfricaAndMiddleEastSubregionNorthAfricaAndMiddleEast]: "North Africa and Middle East",
  [GbdSubRegion.SouthAsiaSubregionSouthAsia]: "South Asia",
  [GbdSubRegion.SouthEastAsiaEastAsiaAndOceaniaSubregionSouthEastAsia]: "South-East Asia",
  [GbdSubRegion.SouthEastAsiaEastAsiaAndOceaniaSubregionOceania]: "Oceania",
  [GbdSubRegion.SouthEastAsiaEastAsiaAndOceaniaSubregionEastAsia]: "East Asia",
  [GbdSubRegion.SubSaharanAfricaSubregionCentral]: "Central Sub-Saharan Africa",
  [GbdSubRegion.SubSaharanAfricaSubregionEastern]: "Eastern Sub-Saharan Africa",
  [GbdSubRegion.SubSaharanAfricaSubregionSouthern]: "Southern Sub-Saharan Africa",
  [GbdSubRegion.SubSaharanAfricaSubregionWestern]: "Western Sub-Saharan Africa"
};

export const isGbdSuperRegion = (gbdSuperRegion: string): gbdSuperRegion is GbdSuperRegion =>
  Object.values(GbdSuperRegion).some((element) => element === gbdSuperRegion);

export const isGbdSubRegion = (gbdSubRegion: string): gbdSubRegion is GbdSubRegion =>
  Object.values(GbdSubRegion).some((element) => element === gbdSubRegion);