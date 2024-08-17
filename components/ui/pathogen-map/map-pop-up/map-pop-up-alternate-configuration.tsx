import { SubestimateTable } from "./subestimate-table";

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
      <SubestimateTable tableConfigurations={props.alternateViewConfiguration.tableConfigurations} />
    </div>
  );
}