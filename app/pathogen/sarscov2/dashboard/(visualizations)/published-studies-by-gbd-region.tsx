import uniq from "lodash/uniq";
import { LegendConfiguration, StackedBarChart } from "@/components/customs/visualizations/stacked-bar-chart";
import {
  SarsCov2Context,
  SarsCov2Estimate,
} from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { useContext } from "react";
import { GbdSubRegion } from "@/gql/graphql";
import { gbdSubRegionToLabelMap, gbdSuperRegionToLabelMap } from "@/lib/gbd-regions";

const barColoursForGdbSubregions: {[key in GbdSubRegion]: string} = {
  [GbdSubRegion.HighIncomeSubregionAsiaPacific]: "#f28e2b",
  [GbdSubRegion.HighIncomeSubregionAustralasia]: "#4e79a7",
  [GbdSubRegion.HighIncomeSubregionNorthAmerica]: "#59a14f",
  [GbdSubRegion.HighIncomeSubregionSouthernLatinAmerica]: "#a0cbe8",
  [GbdSubRegion.HighIncomeSubregionWesternEurope]: "#ffbe7d",
  [GbdSubRegion.CentralEuropeEasternEuropeAndCentralAsiaSubregionCentralAsia]: "#d37295",
  [GbdSubRegion.CentralEuropeEasternEuropeAndCentralAsiaSubregionCentralEurope]: "#d4a6c8",
  [GbdSubRegion.CentralEuropeEasternEuropeAndCentralAsiaSubregionEasternEurope]: "#9d7660",
  [GbdSubRegion.SubSaharanAfricaSubregionCentral]: "#b6992d",
  [GbdSubRegion.SubSaharanAfricaSubregionEastern]: "#499894",
  [GbdSubRegion.SubSaharanAfricaSubregionSouthern]: "#8cd17d",
  [GbdSubRegion.SubSaharanAfricaSubregionWestern]: "#f1ce63",
  [GbdSubRegion.LatinAmericaAndCaribbeanSubregionAndean]: "#ff9d9a",
  [GbdSubRegion.LatinAmericaAndCaribbeanSubregionCaribbean]: "#86bcb6",
  [GbdSubRegion.LatinAmericaAndCaribbeanSubregionCentral]: "#e15759",
  [GbdSubRegion.LatinAmericaAndCaribbeanSubregionTropical]: "#79706e",
  [GbdSubRegion.SouthAsiaSubregionSouthAsia]: "#bab0ac",
  [GbdSubRegion.SouthEastAsiaEastAsiaAndOceaniaSubregionEastAsia]: "#b07aa1",
  [GbdSubRegion.SouthEastAsiaEastAsiaAndOceaniaSubregionOceania]: "#4e79a7",
  [GbdSubRegion.SouthEastAsiaEastAsiaAndOceaniaSubregionSouthEastAsia]: "#fabfd2",
  [GbdSubRegion.NorthAfricaAndMiddleEastSubregionNorthAfricaAndMiddleEast]: "#d7b5a6"
};

interface PublishedStudiesByGdbRegionGraphProps {
  legendConfiguration: LegendConfiguration;
}

export const PublishedStudiesByGdbRegionGraph = (props: PublishedStudiesByGdbRegionGraphProps) => {
  const state = useContext(SarsCov2Context);

  return (
    <StackedBarChart
      graphId="published-sc2-studies-by-gdb-region"
      data={state.filteredData.filter(
        (
          dataPoint: SarsCov2Estimate
        ): dataPoint is Omit<
          SarsCov2Estimate,
          "gbdSuperRegion" | "gbdSubRegion"
        > & {
          gbdSuperRegion: NonNullable<SarsCov2Estimate["gbdSuperRegion"]>;
          gbdSubRegion: NonNullable<SarsCov2Estimate["gbdSubRegion"]>;
        } => !!dataPoint.gbdSuperRegion && !!dataPoint.gbdSubRegion
      )}
      primaryGroupingFunction={(dataPoint) => dataPoint.gbdSuperRegion}
      primaryGroupingKeyToLabel={(gbdSuperRegion) => gbdSuperRegionToLabelMap[gbdSuperRegion]}
      secondaryGroupingFunction={(dataPoint) => dataPoint.gbdSubRegion}
      secondaryGroupingKeyToLabel={(gbdSubRegion) => gbdSubRegionToLabelMap[gbdSubRegion]}
      transformOutputValue={({ data }) => uniq(data.map((dataPoint) => dataPoint.studyName)).length}
      legendConfiguration={props.legendConfiguration}
      xAxisTickSettings={{idealMaximumCharactersPerLine: 10}}
      getBarColour={(gbdSubRegion) => barColoursForGdbSubregions[gbdSubRegion]}
    />
  );
};
