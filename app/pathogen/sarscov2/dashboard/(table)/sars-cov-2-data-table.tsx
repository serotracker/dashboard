import { DataTable } from "@/components/ui/data-table/data-table";
import { columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { DataTableColumnConfigurationEntryType } from "@/components/ui/data-table/data-table-column-config";
import { SarsCov2Context } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { useContext } from "react";

const sarsCov2ColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'whoRegion',
  label: 'WHO Region',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'riskOfBias',
  label: 'Risk of Bias',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sourceType',
  label: 'Source Type',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'scope',
  label: 'Scope',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'isotypes',
  label: 'Isotype',
  isHideable: true,
  isFixed: false,
  valueToColourSchemeClassnameMap: {
    'IgA': 'bg-blue-700 text-white',
    'IgD': 'bg-black text-white',
    'IgE': 'bg-green-200',
    'IgG': 'bg-yellow-400',
    'IgM': 'bg-orange-300',
    'Neutralizing': 'bg-purple-700 text-white',
    'Total Antibody': 'bg-pink-400'
  },
  defaultColourSchemeClassname: 'bg-sky-100'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'seroprevalence',
  label: 'Seroprevalence',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'numeratorValue',
  label: 'Numerator Value',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'denominatorValue',
  label: 'Sample Size',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sex',
  label: 'Sex',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'samplingStartDate',
  label: 'Sampling Start Date',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'samplingEndDate',
  label: 'Sampling End Date',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'publicationDate',
  label: 'Publication Date',
  isHideable: true,
  isFixed: false
}];

export const SarsCov2DataTable = () => {
  const state = useContext(SarsCov2Context);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: sarsCov2ColumnConfiguration })}
      csvFilename="sarscov2tracker_dataset"
      csvCitationConfiguration={{
        enabled: false
      }}
      data={state.filteredData}
    />
  )
}