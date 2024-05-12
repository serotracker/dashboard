"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import React, { useContext } from "react";
import { columns } from "./columns";
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
  isHideable: true,
  isFixed: false,
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
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'antibodies',
  label: 'Antibodies',
  isHideable: true,
  isFixed: false,
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
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'sampleEndDate',
  label: 'Sampling End Date',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'whoRegion',
  label: 'WHO Region',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'assay',
  label: 'Assay',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'assayOther',
  label: 'Assay Other',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'producer',
  label: 'Producer',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'producerOther',
  label: 'Producer Other',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sampleFrame',
  label: 'Sample Frame',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sampleNumerator',
  label: 'Sample Numerator',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sampleSize',
  label: 'Sample Size',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'city',
  label: 'City',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'country',
  label: 'Country',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sex',
  label: 'Sex',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'ageGroup',
  label: 'Age Group',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'pediatricAgeGroup',
  label: 'Pediatric Age Group',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'serotype',
  label: 'Serotype (DENV only)',
  isHideable: true,
  isFixed: false
}, {
  type: DataTableColumnConfigurationEntryType.LINK_BUTTON as const,
  fieldName: 'url',
  label: 'Source',
  isHideable: true,
  isFixed: false,
  fieldNameForLink: 'url'
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
