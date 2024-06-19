import { DataTable, DropdownTableHeader } from "@/components/ui/data-table/data-table";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { WhoRegion } from "@/gql/graphql";
import { useContext } from "react";
import { AvailableMersDataTables } from "./mers-data-table";

const mersCasesColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: '__typename',
  label: 'Event Type'
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
  fieldName: 'city',
  label: 'City'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'state',
  label: 'State'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'country',
  label: 'Country'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'latitude',
  label: 'Latitude'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'longitude',
  label: 'Longitude'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'diagnosisStatus',
  label: 'Diagnosis Status'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'diagnosisSource',
  label: 'Diagnosis Source'
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'observationDate',
  label: 'Observation Date'
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'reportDate',
  label: 'Report Date'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'animalType',
  label: 'Animal Type'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'animalSpecies',
  label: 'Animal Species'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'humansAffected',
  label: 'Humans Affected'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'humanDeaths',
  label: 'Humans Deaths'
}];

interface MersCasesDataTableProps {
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

export const MersCasesDataTable = (props: MersCasesDataTableProps) => {
  const { faoMersEventData } = useContext(MersContext);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: mersCasesColumnConfiguration })}
      csvFilename="merstracker_dataset"
      tableHeader={props.tableHeader}
      csvCitationConfiguration={{
        enabled: false
      }}
      rowExpansionConfiguration={{
        enabled: false
      }}
      data={faoMersEventData.map((event) => ({ ...event, country: event.country.name }))}
    />
  )
}