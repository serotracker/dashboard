import { DataTable, DropdownTableHeader } from "@/components/ui/data-table/data-table";
import { AvailableMersDataTables } from "./mers-data-table";
import { Clade, GenomeSequenced } from "@/gql/graphql";
import { columnConfigurationToColumnDefinitions, DataTableColumnConfigurationEntryType } from "@/components/ui/data-table/data-table-column-config";
import { cladeToColourClassnameMap, genomeSequenceToColourClassnameMap, genomeSequenceToStringMap, isGenomeSequenced } from "../(map)/shared-mers-map-pop-up-variables";
import { useDataTableMapViewingHandler } from "./use-data-table-map-viewing-handler";

const genomicSequencingDataTableColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.LINK as const,
  fieldName: 'estimateId',
  label: 'Estimate ID',
  isHideable: false,
  isFixed: true,
  fieldNameForLink: 'sourceUrl',
  size: 700,
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'country',
  label: 'Country'
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
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'genomeSequenced',
  valueToColourSchemeClassnameMap: genomeSequenceToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  valueToDisplayLabel: (genomeSequenced: string) => isGenomeSequenced(genomeSequenced)
    ? genomeSequenceToStringMap[genomeSequenced]
    : genomeSequenced,
  label: 'Genome Sequenced'
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
  clade: Clade[];
  accessionNumbers: string | null | undefined;
  genomeSequenced: GenomeSequenced[];
  sourceUrl: string;
} & Record<string, unknown>;

interface GenomicSequencingDataTableProps {
  tableData: GenomicSequencingDataEntryForTable[];
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

export const GenomicSequencingDataTable = (props: GenomicSequencingDataTableProps) => {
  const { viewOnMapHandler } = useDataTableMapViewingHandler();

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: genomicSequencingDataTableColumnConfiguration })}
      csvFilename="genomic_sequencing_dataset"
      tableHeader={props.tableHeader}
      csvCitationConfiguration={{
        enabled: false
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