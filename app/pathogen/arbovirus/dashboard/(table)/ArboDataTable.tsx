"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import React, { useContext } from "react";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";

const arboColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.LINK as const,
  fieldName: 'estimateId',
  label: 'Estimate ID',
  isHideable: false,
  isFixed: true,
  fieldNameForLink: 'url'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'pathogen',
  label: 'Arbovirus',
  valueToColourSchemeClassnameMap: {
    'DENV': 'bg-denv',
    'ZIKV': 'bg-zikv',
    'CHIKV': 'bg-chikv',
    'YF': 'bg-yf',
    'WNV': 'bg-wnv',
    'MAYV': 'bg-mayv',
  },
  defaultColourSchemeClassname: 'bg-gray-100'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'seroprevalence',
  label: 'Seroprevalence',
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'antibodies',
  label: 'Antibodies',
  valueToColourSchemeClassnameMap: {
    'IgG': 'bg-blue-700 text-white',
    'IgM': 'bg-black text-white',
    'IgAM': 'bg-green-200',
    'NAb': 'bg-yellow-400',
  },
  defaultColourSchemeClassname: 'bg-sky-100'
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'sampleStartDate',
  label: 'Sampling Start Date',
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'sampleEndDate',
  label: 'Sampling End Date',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'whoRegion',
  label: 'WHO Region',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'assay',
  label: 'Assay',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'assayOther',
  label: 'Assay Other',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'producer',
  label: 'Producer',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'producerOther',
  label: 'Producer Other',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sampleFrame',
  label: 'Sample Frame',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sampleNumerator',
  label: 'Sample Numerator',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sampleSize',
  label: 'Sample Size',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'city',
  label: 'City',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'country',
  label: 'Country',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sex',
  label: 'Sex',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'ageGroup',
  label: 'Age Group',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'pediatricAgeGroup',
  label: 'Pediatric Age Group',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'serotype',
  label: 'Serotype (DENV only)',
}, {
  type: DataTableColumnConfigurationEntryType.LINK_BUTTON as const,
  fieldName: 'url',
  label: 'Source',
  fieldNameForLink: 'url',
  isSortable: false
}];

export const ArboDataTable = () => {
  const state = useContext(ArboContext);

  if (state.filteredData?.length > 0) {
    return (
      <DataTable
        columns={columnConfigurationToColumnDefinitions({ columnConfiguration: arboColumnConfiguration })}
        data={state.filteredData}
      />
    );
  } else {
    return <>Loading Data ...</>;
  }
}
