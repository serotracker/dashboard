import { DataTable, DropdownTableHeader, RowExpansionConfiguration } from "@/components/ui/data-table/data-table";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { MersDiagnosisSource, MersDiagnosisStatus, MersEventAnimalSpecies, MersEventAnimalType, MersEventType, WhoRegion } from "@/gql/graphql";
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
  isMersEventAnimalSpecies,
  isMersEventAnimalType,
  isMersEventTypename,
  mersDataTypeToLabelMap,
  mersDataTypeToColourClassnameMap
} from "../(map)/shared-mers-map-pop-up-variables";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { useDataTableMapViewingHandler } from "./use-data-table-map-viewing-handler";
import { RechartsVisualization } from "@/components/customs/visualizations/recharts-visualization";
import { MersVisualizationId, getUrlParameterFromVisualizationId, mersVisualizationInformation } from "../../visualizations/visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";

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
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'id',
  label: 'ID',
  isHideable: false,
  initiallyVisible: false
}];

interface MersCasesDataTableProps {
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

type FaoMersEventForTableBase = {
  id: FaoMersEvent['id'];
  diagnosisStatus: FaoMersEvent['diagnosisStatus'];
  diagnosisSource: FaoMersEvent['diagnosisSource'];
  eventRawCountry: FaoMersEvent['country'];
  state: FaoMersEvent['state'];
  city: FaoMersEvent['city'];
  eventRawLatitude: FaoMersEvent['latitude'];
  eventRawLongitude: FaoMersEvent['longitude'];
  whoRegion?: FaoMersEvent['whoRegion'];
  observationDate?: FaoMersEvent['observationDate'];
  reportDate: FaoMersEvent['reportDate'];
  country: string;
  latitude: string;
  longitude: string;
} & Record<string, unknown>;

type AnimalFaoMersEventForTable = FaoMersEventForTableBase & {
  __typename: "AnimalMersEvent"
  type: MersEventType.Animal,
  animalType: MersEventAnimalType,
  animalSpecies: MersEventAnimalSpecies
}

type HumanFaoMersEventForTable = FaoMersEventForTableBase & {
  __typename: "HumanMersEvent"
  type: MersEventType.Human,
  humansAffected: number,
  humanDeaths: number,
}

type FaoMersEventForTable = 
  | AnimalFaoMersEventForTable
  | HumanFaoMersEventForTable;

const formatDataForTable = (dataPoint: FaoMersEvent): FaoMersEventForTable => {
  if(dataPoint.__typename === "HumanMersEvent") {
    return {
      ...dataPoint,
      type: MersEventType.Human,
      eventRawLatitude: dataPoint.latitude,
      eventRawLongitude: dataPoint.longitude,
      eventRawCountry: dataPoint.country,
      country: dataPoint.country.name,
      latitude: dataPoint.latitude.toFixed(2),
      longitude: dataPoint.longitude.toFixed(2),
    }
  } else {
    return {
      ...dataPoint,
      type: MersEventType.Animal,
      eventRawLatitude: dataPoint.latitude,
      eventRawLongitude: dataPoint.longitude,
      eventRawCountry: dataPoint.country,
      country: dataPoint.country.name,
      latitude: dataPoint.latitude.toFixed(2),
      longitude: dataPoint.longitude.toFixed(2),
    }
  }
}

const unformatDataFromTable = (dataPoint: FaoMersEventForTable): FaoMersEvent => {
  if(dataPoint.__typename === "HumanMersEvent") {
    return {
      ...dataPoint,
      latitude: dataPoint.eventRawLatitude,
      longitude: dataPoint.eventRawLongitude,
      country: dataPoint.eventRawCountry,
    }
  } else {
    return {
      ...dataPoint,
      latitude: dataPoint.eventRawLatitude,
      longitude: dataPoint.eventRawLongitude,
      country: dataPoint.eventRawCountry,
    }
  }
}

export const MersCasesDataTable = (props: MersCasesDataTableProps) => {
  const { faoMersEventData } = useContext(MersContext);
  const { viewOnMapHandler } = useDataTableMapViewingHandler();

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

      const formattedEvent = unformatDataFromTable(event);
      const formattedData: FaoMersEvent[] = data
        .filter((dataPoint) => dataPoint.country === event.country)
        .map((dataPoint) => unformatDataFromTable(dataPoint));

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
  }), [ viewOnMapHandler ]);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: mersCasesColumnConfiguration })}
      csvFilename="merstracker_dataset"
      tableHeader={props.tableHeader}
      csvCitationConfiguration={{
        enabled: false
      }}
      rowExpansionConfiguration={rowExpansionConfiguration}
      data={faoMersEventData
        .filter((event) => event.diagnosisStatus === MersDiagnosisStatus.Confirmed)
        .map((event) => formatDataForTable(event))
      }
    />
  )
}