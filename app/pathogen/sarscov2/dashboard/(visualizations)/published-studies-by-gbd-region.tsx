import uniq from "lodash/uniq";
import { LegendConfiguration, StackedBarChart } from "@/components/customs/visualizations/stacked-bar-chart";
import {
  SarsCov2Context,
  SarsCov2Estimate,
} from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { useContext } from "react";
import { GbdSubRegion } from "@/gql/graphql";

const barColoursForGdbSubregions: {[key in GbdSubRegion]: string} = {
  [GbdSubRegion.HighIncomeSubregionAsiaPacific]: "#A0C4FF",
  [GbdSubRegion.HighIncomeSubregionAustralasia]: "#A0C4FF",
  [GbdSubRegion.HighIncomeSubregionNorthAmerica]: "#A0C4FF",
  [GbdSubRegion.HighIncomeSubregionSouthernLatinAmerica]: "#A0C4FF",
  [GbdSubRegion.HighIncomeSubregionWesternEurope]: "#A0C4FF",
  [GbdSubRegion.CentralEuropeEasternEuropeAndCentralAsiaSubregionCentralAsia]: "#A0C4FF",
  [GbdSubRegion.CentralEuropeEasternEuropeAndCentralAsiaSubregionCentralEurope]: "#A0C4FF",
  [GbdSubRegion.CentralEuropeEasternEuropeAndCentralAsiaSubregionEasternEurope]: "#A0C4FF",
  [GbdSubRegion.SubSaharanAfricaSubregionCentral]: "#A0C4FF",
  [GbdSubRegion.SubSaharanAfricaSubregionEastern]: "#A0C4FF",
  [GbdSubRegion.SubSaharanAfricaSubregionSouthern]: "#A0C4FF",
  [GbdSubRegion.SubSaharanAfricaSubregionWestern]: "#A0C4FF",
  [GbdSubRegion.LatinAmericaAndCaribbeanSubregionAndean]: "#A0C4FF",
  [GbdSubRegion.LatinAmericaAndCaribbeanSubregionCaribbean]: "#A0C4FF",
  [GbdSubRegion.LatinAmericaAndCaribbeanSubregionCentral]: "#A0C4FF",
  [GbdSubRegion.LatinAmericaAndCaribbeanSubregionTropical]: "#A0C4FF",
  [GbdSubRegion.SouthAsiaSubregionSouthAsia]: "#A0C4FF",
  [GbdSubRegion.SouthEastAsiaEastAsiaAndOceaniaSubregionEastAsia]: "#A0C4FF",
  [GbdSubRegion.SouthEastAsiaEastAsiaAndOceaniaSubregionOceania]: "#A0C4FF",
  [GbdSubRegion.SouthEastAsiaEastAsiaAndOceaniaSubregionSouthEastAsia]: "#A0C4FF",
  [GbdSubRegion.NorthAfricaAndMiddleEastSubregionNorthAfricaAndMiddleEast]: "#A0C4FF"
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
      secondaryGroupingFunction={(dataPoint) => dataPoint.gbdSubRegion}
      transformOutputValue={(data) => uniq(data.map((dataPoint) => dataPoint.studyName)).length}
      legendConfiguration={props.legendConfiguration}
      getBarColour={(gbdSubRegion) => barColoursForGdbSubregions[gbdSubRegion]}
    />
  );
};
