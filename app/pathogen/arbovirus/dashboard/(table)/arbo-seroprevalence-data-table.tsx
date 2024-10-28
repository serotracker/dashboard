import { DataTable, DataTableCsvCitationConfiguration, RowExpansionConfiguration, TableHeader } from "@/components/ui/data-table/data-table";
import { columnConfigurationToColumnDefinitions, DataTableColumnConfigurationEntry } from "@/components/ui/data-table/data-table-column-config";
import { ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { ArbovirusDataTableType } from "./ArboDataTable";

interface ArboSeroprevalenceDataTableProps {
  data: Array<ArbovirusEstimate & { conciseEstimateId: string }>;
  columnConfiguration: readonly DataTableColumnConfigurationEntry[];
  tableHeader: TableHeader<ArbovirusDataTableType>
  rowExpansionConfiguration: RowExpansionConfiguration<ArbovirusEstimate>;
  csvCitationConfiguration: DataTableCsvCitationConfiguration;
}

export const ArboSeroprevalenceDataTable = (
  props: ArboSeroprevalenceDataTableProps
) => {
  const { data, columnConfiguration, tableHeader, rowExpansionConfiguration, csvCitationConfiguration } = props;

  if (data.length > 0) {
    return (
      <DataTable
        columns={columnConfigurationToColumnDefinitions({ columnConfiguration })}
        csvFilename="arbotracker_dataset"
        tableHeader={tableHeader}
        csvCitationConfiguration={csvCitationConfiguration}
        additionalButtonConfiguration={{
          enabled: false
        }}
        rowExpansionConfiguration={rowExpansionConfiguration}
        data={data}
      />
    );
  } else {
    return <> No Seroprevalence Data Available </>;
  }
}