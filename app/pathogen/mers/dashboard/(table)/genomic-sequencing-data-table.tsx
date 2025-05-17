import { DataTable, DropdownTableHeader } from "@/components/ui/data-table/data-table";
import { AvailableMersDataTables } from "./mers-data-table";
import { Clade, GenomeSequenced, MersAnimalSpecies, WhoRegion } from "@/gql/graphql";
import { columnConfigurationToColumnDefinitions, DataTableColumnConfigurationEntryType } from "@/components/ui/data-table/data-table-column-config";
import { animalSpeciesToColourClassnameMap, animalSpeciesToStringMap, cladeToColourClassnameMap, genomeSequenceToColourClassnameMap, genomeSequenceToStringMap, isGenomeSequenced, isMersAnimalSpecies, specimenTypeToColourClassnameMap } from "../(map)/shared-mers-map-pop-up-variables";
import { useDataTableMapViewingHandler } from "./use-data-table-map-viewing-handler";
import { useContext, useMemo } from "react";
import { MersFilterMetadataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-filter-metadata-context";
import { MERSTrackerCitationButtonContent, shortenedMERSTrackerCitationText, suggestedMERSTrackerCitationText } from "../../merstracker-citations";
import { ToastId } from "@/contexts/toast-provider";

const genomicSequencingDataTableColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.LINK as const,
  fieldName: 'conciseEstimateId',
  label: 'Estimate ID',
  isHideable: false,
  isFixed: true,
  fieldNameForLink: 'sourceUrl',
  size: 400,
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'estimateId',
  label: 'Full Estimate ID',
  initiallyVisible: false
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
  fieldName: 'country',
  label: 'Country or Area'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'location',
  label: 'Location'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'state',
  label: 'State'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'city',
  label: 'City'
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'samplingStartDate',
  label: 'Sampling Start Date',
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'samplingEndDate',
  label: 'Sampling End Date',
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'specimenType',
  valueToColourSchemeClassnameMap: specimenTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Specimen Type'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'animalSpecies',
  valueToDisplayLabel: (animalSpecies: string) => isMersAnimalSpecies(animalSpecies) ? animalSpeciesToStringMap[animalSpecies] : animalSpecies,
  valueToColourSchemeClassnameMap: animalSpeciesToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Animal Species'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'genomeSequenced',
  valueToColourSchemeClassnameMap: genomeSequenceToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  valueToDisplayLabel: (genomeSequenced: string) => isGenomeSequenced(genomeSequenced)
    ? genomeSequenceToStringMap[genomeSequenced]
    : genomeSequenced,
  label: 'Genome Coverage'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'clade',
  valueToColourSchemeClassnameMap: cladeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Clade'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'accessionNumbers',
  label: 'Accession Numbers',
}, {
  type: DataTableColumnConfigurationEntryType.LINK_BUTTON as const,
  fieldName: 'sourceUrl',
  label: 'Source',
  fieldNameForLink: 'sourceUrl'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'id',
  label: 'ID',
  isHideable: false,
  initiallyVisible: false
}];

export type GenomicSequencingDataEntryForTable = {
  id: string;
  latitude: number;
  longitude: number;
  estimateId: string;
  country: string;
  state: string | null | undefined;
  city: string | null | undefined;
  clade: Clade[];
  accessionNumbers: string | null | undefined;
  genomeSequenced: GenomeSequenced[];
  sourceUrl: string;
  animalSpecies: MersAnimalSpecies[] | undefined;
  specimenType: string[];
  whoRegion: WhoRegion | null | undefined;
  samplingStartDate: string | null | undefined;
  samplingEndDate: string | null | undefined;
} & Record<string, unknown>;

interface GenomicSequencingDataTableProps {
  tableData: GenomicSequencingDataEntryForTable[];
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

export const GenomicSequencingDataTable = (props: GenomicSequencingDataTableProps) => {
  const { viewOnMapHandler } = useDataTableMapViewingHandler();
  const { dataTableAdditionalButtonConfig } = useContext(MersFilterMetadataContext);

  const csvCitationConfiguration = useMemo(() => ({
    enabled: true,
    citationText: suggestedMERSTrackerCitationText,
    csvDownloadCitationText: shortenedMERSTrackerCitationText,
    toastId: ToastId.MERSTRACKER_DOWNLOAD_CSV_CITATION_TOAST,
    buttonContent: <MERSTrackerCitationButtonContent />
  }), []);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: genomicSequencingDataTableColumnConfiguration })}
      csvFilename="genomic_sequencing_dataset"
      tableHeader={props.tableHeader}
      csvCitationConfiguration={csvCitationConfiguration}
      additionalButtonConfiguration={dataTableAdditionalButtonConfig}
      secondAdditionalButtonConfiguration={{
        enabled: true,
        buttonText: "Data Dictionary",
        link: "https://airtable.com/app3ebPi0gt39r3xI/shrWqXLuWPhnic2xw"
      }}
      rowExpansionConfiguration={{
        enabled: true,
        generateExpandedRowStatement: () => "Clicking on this row in the table again will minimize it.",
        visualization: () => null,
        additionalTable: () => null,
        viewOnMapHandler
      }}
      data={props.tableData}
    />
  )
}