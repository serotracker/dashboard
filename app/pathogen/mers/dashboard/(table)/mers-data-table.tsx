import { DropdownTableHeader, TableHeaderType } from "@/components/ui/data-table/data-table";
import { useMemo, useState } from "react";
import { MersSeroprevalenceEstimateDataTable } from "./mers-seroprevalence-estimate-data-table";
import { MersCasesDataTable } from "./mers-cases-data-table";
import { CamelPopulationDataTable } from "./camel-population-data-table";
import { MersViralEstimateDataTable } from "./mers-viral-estimates-data-table";
import { useMersDataTableData } from "./use-mers-data-table-data";
import { camelPopulationProvidedCourtesyOfFaoTooltipContent, eventsProvidedCourtesyOfFaoTooltipContent } from "../(map)/use-mers-map-customization-modal";
import { GenomicSequencingDataEntryForTable, GenomicSequencingDataTable } from "./genomic-sequencing-data-table";

export enum AvailableMersDataTables {
  MERS_SEROPREVALENCE_ESTIMATES = "MERS_SEROPREVALENCE_ESTIMATES",
  MERS_VIRAL_ESTIMATES = "MERS_VIRAL_ESTIMATES",
  MERS_CASES = "MERS_CASES",
  CAMEL_POPULATION_DATA = "CAMEL_POPULATION_DATA",
  GENOMIC_SEQUENCING_DATA = "GENOMIC_SEQUENCING_DATA",
  UNAVAILABLE = "UNAVAILABLE"
}

export const genomicSequencingDataTooltipContent = (
  <>
    <p className="inline">Our genomic sequencing data is pulled from the seroprevalence and viral positive prevalence estimates which reported genomic sequencing data.</p>
  </>
)

const availableMersDataTableToHeaderTooltipContent = {
  [AvailableMersDataTables.MERS_SEROPREVALENCE_ESTIMATES]: undefined,
  [AvailableMersDataTables.MERS_VIRAL_ESTIMATES]: undefined,
  [AvailableMersDataTables.MERS_CASES]: eventsProvidedCourtesyOfFaoTooltipContent,
  [AvailableMersDataTables.CAMEL_POPULATION_DATA]: camelPopulationProvidedCourtesyOfFaoTooltipContent,
  [AvailableMersDataTables.GENOMIC_SEQUENCING_DATA]: genomicSequencingDataTooltipContent,
  [AvailableMersDataTables.UNAVAILABLE]: undefined,
}

export const MersDataTable = () => {
  const [
    currentlySelectedDataTable,
    setCurrentlySelectedDataTable 
  ] = useState<AvailableMersDataTables>(AvailableMersDataTables.MERS_SEROPREVALENCE_ESTIMATES);

  const {
    mersSeroprevalenceEstimateData,
    mersViralEstimateData,
    mersEventData,
    camelPopulationData,
  } = useMersDataTableData();

  const estimatesWithGenomicSequencingData: GenomicSequencingDataEntryForTable[] = useMemo(() => [...mersSeroprevalenceEstimateData, ...mersViralEstimateData]
    .filter((estimate) => !!estimate.primaryEstimateSequencingDone)
    .map((estimate) => ({
      id: estimate.id,
      latitude: estimate.latitude,
      longitude: estimate.longitude,
      estimateId: estimate.estimateId,
      country: estimate.primaryEstimateCountry,
      clade: estimate.primaryEstimateClade,
      accessionNumbers: estimate.primaryEstimateAccessionNumbers,
      genomeSequenced: estimate.primaryEstimateGenomeSequenced,
      sourceUrl: estimate.primaryEstimateSourceUrl
    }))
  , [ mersSeroprevalenceEstimateData, mersViralEstimateData ]);

  const availableDropdownOptionGroups = useMemo(() => {
    const returnValue = [
      ...(mersSeroprevalenceEstimateData.length > 0 ? [ AvailableMersDataTables.MERS_SEROPREVALENCE_ESTIMATES ] : []),
      ...(mersViralEstimateData.length > 0 ? [ AvailableMersDataTables.MERS_VIRAL_ESTIMATES ] : []),
      ...(mersEventData.length > 0 ? [ AvailableMersDataTables.MERS_CASES ] : []),
      ...(camelPopulationData.length > 0 ? [ AvailableMersDataTables.CAMEL_POPULATION_DATA ] : []),
      ...(estimatesWithGenomicSequencingData.length > 0 ? [ AvailableMersDataTables.GENOMIC_SEQUENCING_DATA ] : []),
    ];

    if(returnValue.length === 0) {
      return [
        AvailableMersDataTables.UNAVAILABLE
      ];
    }

    return returnValue;
  }, [ mersSeroprevalenceEstimateData, mersViralEstimateData, mersEventData, camelPopulationData, estimatesWithGenomicSequencingData ])

  const cleanedSelectedDataTable = useMemo(() => {
    if(availableDropdownOptionGroups.includes(currentlySelectedDataTable)) {
      return currentlySelectedDataTable;
    }

    return availableDropdownOptionGroups.at(0) ?? AvailableMersDataTables.UNAVAILABLE;
  }, [ currentlySelectedDataTable, availableDropdownOptionGroups ])

  const tableHeaderForAllDataTables: DropdownTableHeader<AvailableMersDataTables> = useMemo(() => ({
    type: TableHeaderType.DROPDOWN,
    beforeDropdownHeaderText: "Explore ",
    dropdownProps: {
      dropdownName: 'Data table selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Available data tables',
        options: availableDropdownOptionGroups
      }],
      chosenDropdownOption: cleanedSelectedDataTable,
      dropdownOptionToLabelMap: {
        [AvailableMersDataTables.MERS_SEROPREVALENCE_ESTIMATES]: "MERS seroprevalence estimates",
        [AvailableMersDataTables.MERS_VIRAL_ESTIMATES]: "MERS viral estimates",
        [AvailableMersDataTables.MERS_CASES]: "Confirmed MERS cases",
        [AvailableMersDataTables.CAMEL_POPULATION_DATA]: "Camel population data",
        [AvailableMersDataTables.GENOMIC_SEQUENCING_DATA]: "Genomic sequencing data",
        [AvailableMersDataTables.UNAVAILABLE]: "Unavailable",
      },
      onDropdownOptionChange: (option) => setCurrentlySelectedDataTable(option)
    },
    afterDropdownHeaderText: " in our database",
    headerTooltipContent: availableMersDataTableToHeaderTooltipContent[cleanedSelectedDataTable]
  }), [ availableDropdownOptionGroups, cleanedSelectedDataTable, setCurrentlySelectedDataTable ]);

  const dataTableComponentMap = useMemo(() => ({
    [AvailableMersDataTables.MERS_SEROPREVALENCE_ESTIMATES]: () => (
      <MersSeroprevalenceEstimateDataTable tableHeader={tableHeaderForAllDataTables} tableData={mersSeroprevalenceEstimateData}/>
    ),
    [AvailableMersDataTables.MERS_VIRAL_ESTIMATES]: () => (
      <MersViralEstimateDataTable tableHeader={tableHeaderForAllDataTables} tableData={mersViralEstimateData}/>
    ),
    [AvailableMersDataTables.MERS_CASES]: () => (
      <MersCasesDataTable tableHeader={tableHeaderForAllDataTables} tableData={mersEventData} />
    ),
    [AvailableMersDataTables.CAMEL_POPULATION_DATA]: () => (
      <CamelPopulationDataTable tableHeader={tableHeaderForAllDataTables} tableData={camelPopulationData} />
    ),
    [AvailableMersDataTables.GENOMIC_SEQUENCING_DATA]: () => (
      <GenomicSequencingDataTable tableHeader={tableHeaderForAllDataTables} tableData={estimatesWithGenomicSequencingData} />
    ),
    [AvailableMersDataTables.UNAVAILABLE]: () => (
      <p> No data available for table. </p>
    )
  }), [ tableHeaderForAllDataTables, mersSeroprevalenceEstimateData, mersViralEstimateData, mersEventData, camelPopulationData, estimatesWithGenomicSequencingData ]);

  return dataTableComponentMap[cleanedSelectedDataTable]();
}