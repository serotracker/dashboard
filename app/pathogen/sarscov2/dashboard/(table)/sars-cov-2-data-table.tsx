import { DataTable } from "@/components/ui/data-table/data-table";
import { columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { DataTableColumnConfigurationEntryType } from "@/components/ui/data-table/data-table-column-config";
import { SarsCov2Context } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { gbdSubRegionToLabelMap, gbdSuperRegionToLabelMap, isGbdSubRegion, isGbdSuperRegion } from "@/lib/gbd-regions";
import { getLabelForUNRegion, isUNRegion } from "@/lib/un-regions";
import { useContext } from "react";

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
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sourceType',
  label: 'Source Type',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'scope',
  label: 'Scope',
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