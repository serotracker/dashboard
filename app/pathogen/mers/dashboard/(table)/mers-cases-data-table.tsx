import { DataTable, DropdownTableHeader, RowExpansionConfiguration } from "@/components/ui/data-table/data-table";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { MersDiagnosisStatus, MersEventAnimalType, MersEventType, WhoRegion } from "@/gql/graphql";
import { useContext, useMemo } from "react";
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
  isMersEventAnimalType,
  isMersEventTypename,
  mersDataTypeToLabelMap,
  mersDataTypeToColourClassnameMap,
  isMersAnimalSpecies
} from "../(map)/shared-mers-map-pop-up-variables";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { useDataTableMapViewingHandler } from "./use-data-table-map-viewing-handler";
import { RechartsVisualization } from "@/components/customs/visualizations/recharts-visualization";
import { MersVisualizationId, getUrlParameterFromVisualizationId, useVisualizationPageConfiguration } from "../../visualizations/visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { FaoMersEventForTable, unformatMersEventDataFromTable } from "./use-mers-data-table-data";
import { MersFilterMetadataContext, MersFilterMetadataProvider } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-filter-metadata-context";

const mersCasesColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'reportDate',
  label: 'Report Date',
  isFixed: true,
  isHideable: false,
  size: 200
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: '__typename',
  valueToDisplayLabel: (typename: string) => isMersEventTypename(typename) ? mersDataTypeToLabelMap[typename] : typename,
  valueToColourSchemeClassnameMap: mersDataTypeToColourClassnameMap,
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
  label: 'Country or Area'
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
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'animalType',
  valueToDisplayLabel: (animalType: string) => isMersEventAnimalType(animalType) ? animalTypeToStringMap[animalType] : animalType,
  valueToColourSchemeClassnameMap: animalTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Animal Type'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'animalSpecies',
  valueToDisplayLabel: (animalSpecies: string) => isMersAnimalSpecies(animalSpecies) ? animalSpeciesToStringMap[animalSpecies] : animalSpecies,
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
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'id',
  label: 'ID',
  isHideable: false,
  initiallyVisible: false
}];

interface MersCasesDataTableProps {
  tableData: FaoMersEventForTable[];
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

export const MersCasesDataTable = (props: MersCasesDataTableProps) => {
  const { viewOnMapHandler } = useDataTableMapViewingHandler();
  const { mersVisualizationInformation } = useVisualizationPageConfiguration();
  const { dataTableAdditionalButtonConfig } = useContext(MersFilterMetadataContext);

  const rowExpansionConfiguration: RowExpansionConfiguration<FaoMersEventForTable> = useMemo(() => ({
    enabled: true,
    generateExpandedRowStatement: ({ data, row }) => 'Clicking on this row in the table again will minimize it',
    visualization: ({ data, row, className }) => {
      const eventId = row.getValue('id');

      if(!eventId) {
        return null;
      }

      const event = data.find((dataPoint) => dataPoint.id === eventId);

      if(!event) {
        return null;
      }

      const countryName = event.country

      const formattedEvent = unformatMersEventDataFromTable(event);
      const formattedData: FaoMersEvent[] = data
        .filter((dataPoint) => dataPoint.country === event.country)
        .map((dataPoint) => unformatMersEventDataFromTable(dataPoint));

      return (
        <RechartsVisualization
          className="h-full-screen"
          data={formattedData}
          highlightedDataPoint={formattedEvent}
          hideArbovirusDropdown={true}
          visualizationInformation={{
            ...mersVisualizationInformation[MersVisualizationId.REPORTED_EVENT_SUMMARY_OVER_TIME],
            getDisplayName: () => ({
              type: VisualizationDisplayNameType.STANDARD,
              displayName: `MERS Event summary for ${countryName}`
            })
          }}
          getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
          buttonConfig={{
            downloadButton: {
              enabled: true,
            },
            zoomInButton: {
              enabled: false,
            },
            closeButton: {
              enabled: false,
            }
          }}
        />
      );
    },
    viewOnMapHandler
  }), [ viewOnMapHandler, mersVisualizationInformation ]);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: mersCasesColumnConfiguration })}
      csvFilename="merstracker_dataset"
      tableHeader={props.tableHeader}
      csvCitationConfiguration={{
        enabled: false
      }}
      additionalButtonConfiguration={dataTableAdditionalButtonConfig}
      rowExpansionConfiguration={rowExpansionConfiguration}
      data={props.tableData}
    />
  )
}