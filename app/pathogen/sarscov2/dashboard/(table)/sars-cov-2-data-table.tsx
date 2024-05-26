import { DataTable } from "@/components/ui/data-table/data-table";
import { columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { DataTableColumnConfigurationEntryType } from "@/components/ui/data-table/data-table-column-config";
import { SarsCov2Context } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { gbdSubRegionToLabelMap, gbdSuperRegionToLabelMap, isGbdSubRegion, isGbdSuperRegion } from "@/lib/gbd-regions";
import { getLabelForUNRegion, isUNRegion } from "@/lib/un-regions";
import { useContext } from "react";

const ageGroupToSortOrderMap: Record<string, number | undefined> = {
  'Children and Youth (0-17 years)': 1,
  'Adults (18-64 years)': 2,
  'Seniors (65+ years)': 3,
  'Multiple groups': 4
};

const riskOfBiasToSortOrderMap: Record<string, number | undefined> = {
  'Missing': 1,
  'High': 2,
  'Moderate': 3,
  'Low': 4,
};

const scopeToSortOrderMap: Record<string, number | undefined> = {
  'Local': 1,
  'Regional': 2,
  'National': 3
};

const sarsCov2ColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.LINK as const,
  fieldName: 'estimateName',
  label: 'Estimate Name',
  isHideable: false,
  isFixed: true,
  fieldNameForLink: 'url'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'whoRegion',
  label: 'WHO Region',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'unRegion',
  label: 'UN Region',
  valueToDisplayLabel: (unRegion: string) => isUNRegion(unRegion) ? getLabelForUNRegion(unRegion) : unRegion
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'gbdSuperRegion',
  label: 'GBD Super Region',
  valueToDisplayLabel: (gbdSuperRegion: string) => isGbdSuperRegion(gbdSuperRegion) ? gbdSuperRegionToLabelMap[gbdSuperRegion] : gbdSuperRegion
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'gbdSubRegion',
  label: 'GBD Sub Region',
  valueToDisplayLabel: (gbdSubRegion: string) => isGbdSubRegion(gbdSubRegion) ? gbdSubRegionToLabelMap[gbdSubRegion] : gbdSubRegion
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'riskOfBias',
  label: 'Risk of Bias',
  valueSortingFunction: (riskOfBiasA: string, riskOfBiasB: string) => (riskOfBiasToSortOrderMap[riskOfBiasA] ?? 0) - (riskOfBiasToSortOrderMap[riskOfBiasB] ?? 0)
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sourceType',
  label: 'Source Type',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'scope',
  label: 'Scope',
  valueSortingFunction: (scopeA: string, scopeB: string) => (scopeToSortOrderMap[scopeA] ?? 0) - (scopeToSortOrderMap[scopeB] ?? 0)
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'country',
  label: 'Country',
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'isotypes',
  label: 'Isotype',
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
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'antibodies',
  label: 'Antibodies',
  valueToColourSchemeClassnameMap: {
    'Envelope protein': 'bg-blue-700 text-white',
    'Membrane protein': 'bg-pink-400',
    'Multiplex': 'bg-green-200',
    'Nucleocapsid (N-protein)': 'bg-yellow-400',
    'Spike': 'bg-purple-700 text-white',
    'Whole-virus antigen': 'bg-orange-300'
  },
  defaultColourSchemeClassname: 'bg-sky-100'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'testType',
  label: 'Test Type',
  valueToColourSchemeClassnameMap: {
    'CGIA/RDT': 'bg-blue-700 text-white',
    'CLIA': 'bg-green-200',
    'CMIA': 'bg-pink-400',
    'ELISA': 'bg-black text-white',
    'IFA': 'bg-red-500',
    'LFIA': 'bg-fuchsia-300',
    'Luminex': 'bg-green-700 text-white',
    'Multiple Types': 'bg-yellow-400',
    'Neutralization': 'bg-purple-700 text-white',
    'Neutralization Assay': 'bg-orange-300'
  },
  defaultColourSchemeClassname: 'bg-sky-100'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'seroprevalence',
  label: 'Seroprevalence',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'numeratorValue',
  label: 'Numerator Value',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'denominatorValue',
  label: 'Sample Size',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sex',
  label: 'Sex',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'ageGroup',
  label: 'Age Group',
  valueSortingFunction: (ageGroupA: string, ageGroupB: string) => (ageGroupToSortOrderMap[ageGroupA] ?? 0) - (ageGroupToSortOrderMap[ageGroupB] ?? 0)
}, {
  type: DataTableColumnConfigurationEntryType.BOOLEAN as const,
  fieldName: 'isWHOUnityAligned',
  label: 'Unity Aligned?',
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'samplingStartDate',
  label: 'Sampling Start Date',
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'samplingEndDate',
  label: 'Sampling End Date',
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'publicationDate',
  label: 'Publication Date',
}, {
  type: DataTableColumnConfigurationEntryType.LINK_BUTTON as const,
  fieldName: 'url',
  label: 'Source',
  fieldNameForLink: 'url',
  isSortable: false
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