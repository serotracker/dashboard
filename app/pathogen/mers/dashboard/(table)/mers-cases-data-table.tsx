import { DataTable, DropdownTableHeader } from "@/components/ui/data-table/data-table";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { MersDiagnosisStatus, WhoRegion } from "@/gql/graphql";
import { useContext } from "react";
import { AvailableMersDataTables } from "./mers-data-table";
import {
  animalSpeciesToColourClassnameMap,
  animalSpeciesToStringMap,
  animalTypeToColourClassnameMap,
  animalTypeToStringMap,
  diagnosisSourceToColourClassnameMap,
  diagnosisSourceToStringMap,
  diagnosisStatusToColourClassnameMap,
  diagnosisStatusToStringMap,
  isMersDiagnosisSource,
  isMersDiagnosisStatus,
  isMersEventAnimalSpecies,
  isMersEventAnimalType,
  isMersEventTypename,
  mersEventTypenameToColourClassnameMap,
  mersEventTypenameToLabelMap
} from "../(map)/shared-mers-map-pop-up-variables";

const mersCasesColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: '__typename',
  valueToDisplayLabel: (typename: string) => isMersEventTypename(typename) ? mersEventTypenameToLabelMap[typename] : typename,
  valueToColourSchemeClassnameMap: mersEventTypenameToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
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
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'diagnosisStatus',
  valueToDisplayLabel: (diagnosisStatus: string) => isMersDiagnosisStatus(diagnosisStatus) ? diagnosisStatusToStringMap[diagnosisStatus] : diagnosisStatus,
  valueToColourSchemeClassnameMap: diagnosisStatusToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Diagnosis Status'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'diagnosisSource',
  valueToDisplayLabel: (diagnosisSource: string) => isMersDiagnosisSource(diagnosisSource) ? diagnosisSourceToStringMap[diagnosisSource] : diagnosisSource,
  valueToColourSchemeClassnameMap: diagnosisSourceToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
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
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'animalType',
  valueToDisplayLabel: (animalType: string) => isMersEventAnimalType(animalType) ? animalTypeToStringMap[animalType] : animalType,
  valueToColourSchemeClassnameMap: animalTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Animal Type'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'animalSpecies',
  valueToDisplayLabel: (animalSpecies: string) => isMersEventAnimalSpecies(animalSpecies) ? animalSpeciesToStringMap[animalSpecies] : animalSpecies,
  valueToColourSchemeClassnameMap: animalSpeciesToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
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
      data={faoMersEventData
        .filter((event) => event.diagnosisStatus === MersDiagnosisStatus.Confirmed)
        .map((event) => ({
          ...event,
          country: event.country.name,
          latitude: event.latitude.toFixed(2),
          longitude: event.longitude.toFixed(2),
        })
      )}
    />
  )
}