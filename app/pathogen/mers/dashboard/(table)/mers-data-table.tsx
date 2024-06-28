import { DropdownTableHeader, TableHeaderType } from "@/components/ui/data-table/data-table";
import { useState } from "react";
import { MersSeroprevalenceEstimateDataTable } from "./mers-seroprevalence-estimate-data-table";
import { MersCasesDataTable } from "./mers-cases-data-table";
import { CamelPopulationDataTable } from "./camel-population-data-table";

export enum AvailableMersDataTables {
  MERS_SEROPREVALENCE_ESTIMATES = "MERS_SEROPREVALENCE_ESTIMATES",
  MERS_CASES = "MERS_CASES",
  CAMEL_POPULATION_DATA = "CAMEL_POPULATION_DATA",
}

export const MersDataTable = () => {
  const [
    currentlySelectedDataTable,
    setCurrentlySelectedDataTable 
  ] = useState<AvailableMersDataTables>(AvailableMersDataTables.MERS_SEROPREVALENCE_ESTIMATES);

  const tableHeaderForAllDataTables: DropdownTableHeader<AvailableMersDataTables> = {
    type: TableHeaderType.DROPDOWN,
    beforeDropdownHeaderText: "Explore ",
    dropdownProps: {
      dropdownName: 'Data table selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Available data tables',
        options: [
          AvailableMersDataTables.MERS_SEROPREVALENCE_ESTIMATES,
          AvailableMersDataTables.MERS_CASES,
          AvailableMersDataTables.CAMEL_POPULATION_DATA,
        ]
      }],
      chosenDropdownOption: currentlySelectedDataTable,
      dropdownOptionToLabelMap: {
        [AvailableMersDataTables.MERS_SEROPREVALENCE_ESTIMATES]: "MERS seroprevalence estimates",
        [AvailableMersDataTables.MERS_CASES]: "Confirmed MERS cases",
        [AvailableMersDataTables.CAMEL_POPULATION_DATA]: "Camel population data",
      },
      onDropdownOptionChange: (option) => setCurrentlySelectedDataTable(option)
    },
    afterDropdownHeaderText: " in our database"
  }

  const dataTableComponentMap = {
    [AvailableMersDataTables.MERS_SEROPREVALENCE_ESTIMATES]: () => <MersSeroprevalenceEstimateDataTable tableHeader={tableHeaderForAllDataTables} />,
    [AvailableMersDataTables.MERS_CASES]: () => <MersCasesDataTable tableHeader={tableHeaderForAllDataTables} />,
    [AvailableMersDataTables.CAMEL_POPULATION_DATA]: () => <CamelPopulationDataTable tableHeader={tableHeaderForAllDataTables} />
  }

  return dataTableComponentMap[currentlySelectedDataTable]();
}