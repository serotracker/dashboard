import { DataTable, DropdownTableHeader } from "@/components/ui/data-table/data-table";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { CamelPopulationDataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/camel-population-data-context";
import { useContext } from "react";
import { AvailableMersDataTables } from "./mers-data-table";
import { WhoRegion } from "@/gql/graphql";

const camelPopulationDataTableColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'country',
  label: 'Country',
  isFixed: true,
  isHideable: false
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'whoRegion',
  label: 'WHO Region',
  valueToColourSchemeClassnameMap: {
    [WhoRegion.Afr]: "bg-who-region-afr",
    [WhoRegion.Amr]: "bg-who-region-amr",
    [WhoRegion.Emr]: "bg-who-region-emr",
    [WhoRegion.Eur]: "bg-who-region-eur",
    [WhoRegion.Sear]: "bg-who-region-sear",
    [WhoRegion.Wpr]: "bg-who-region-wpr text-white"
  },
  defaultColourSchemeClassname: 'bg-sky-100'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'year',
  label: 'Year'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'camelCount',
  label: 'Camel Count'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'camelCountPerCapita',
  label: 'Camel Count Per Capita'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'note',
  label: 'Note'
}];

interface CamelPopulationDataTableProps {
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

export const CamelPopulationDataTable = (props: CamelPopulationDataTableProps) => {
  const { latestFaoCamelPopulationDataPointsByCountry } = useContext(CamelPopulationDataContext);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: camelPopulationDataTableColumnConfiguration })}
      csvFilename="merstracker_dataset"
      tableHeader={props.tableHeader}
      csvCitationConfiguration={{
        enabled: false
      }}
      rowExpansionConfiguration={{
        enabled: false
      }}
      data={(latestFaoCamelPopulationDataPointsByCountry ?? []).map((dataPoint) => ({
        ...dataPoint,
        country: dataPoint.country.name,
        countryAlphaThreeCode: dataPoint.country.alphaThreeCode,
        countryAlphaTwoCode: dataPoint.country.alphaTwoCode,
      }))}
    />
  )
}