import { cn } from "@/lib/utils";

export interface AlternateViewConfigurationTableConfiguration {
  tableHeader: string;
  tableFields: string[];
  tableRows: Array<{
    rowColourClassname?: string;
    values: Record<string, string | undefined>
  }>;
}

interface EnabledAlternateViewConfiguration {
  enabled: true;
  tableConfigurations: AlternateViewConfigurationTableConfiguration[];
}

interface DisabledAlternateViewConfiguration {
  enabled: false;
}

export type AlternateViewConfiguration = EnabledAlternateViewConfiguration | DisabledAlternateViewConfiguration;

interface AlternateViewGenericMapPopUpContentProps {
  alternateViewConfiguration: EnabledAlternateViewConfiguration;
}

export const AlternateViewGenericMapPopUpContent = (props: AlternateViewGenericMapPopUpContentProps) => {
  return (
    <div className="w-full">
      {props.alternateViewConfiguration.tableConfigurations.map((tableConfiguration, index) => (
        <div className={cn("w-full", index > 0 ? 'mt-4' : '')} key={tableConfiguration.tableHeader}>
          <p className="w-full text-center font-semibold"> {tableConfiguration.tableHeader} </p>
          <table className="w-full">
            <thead>
              <tr>
                {tableConfiguration.tableFields.map((tableField) => (
                  <th className="border px-1" key={tableField}>
                    {tableField}
                  </th>
                ))}
              </tr>
            </thead>
            {tableConfiguration.tableRows.map((tableRow) => (
              <tr key={JSON.stringify(tableRow.values)}>
                {tableConfiguration.tableFields.map((tableField) => (
                  <td className={cn(
                    "border px-1 text-center",
                    tableRow.rowColourClassname ?? ''
                  )} key={tableField}>
                    {tableRow.values[tableField] ?? 'Not reported'}
                  </td>
                ))}
              </tr>
            ))}
          </table>
        </div>
      ))}
    </div>
  );
}