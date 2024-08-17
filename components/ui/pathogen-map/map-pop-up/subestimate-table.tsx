import { cn } from "@/lib/utils";
import { AlternateViewConfigurationTableConfiguration } from "./map-pop-up-alternate-configuration";

interface SubestimateTableProps {
  tableConfigurations: AlternateViewConfigurationTableConfiguration[];
}

export const SubestimateTable = (props: SubestimateTableProps) => (
  <>
    {props.tableConfigurations.map((tableConfiguration, index) => (
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
  </>
)