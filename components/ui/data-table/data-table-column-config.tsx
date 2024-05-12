import { DataTableColumnDef } from "./data-table";
import { getDataTableColouredPillListColumnConfiguration } from "./data-table-column-configurations/data-table-coloured-pill-list-column-configuration";
import { getDataTableDateColumnConfiguration } from "./data-table-column-configurations/data-table-date-column-configuration";
import { getDataTableStandardColumnConfiguration } from "./data-table-column-configurations/data-table-standard-column-configuration";
import { getDataTablePercentageColumnConfiguration } from "./data-table-column-configurations/date-table-percentage-column-configuration";

export enum DataTableColumnConfigurationEntryType {
  STANDARD = "STANDARD",
  LINK = "LINK",
  LINK_BUTTON = "LINK_BUTTON",
  COLOURED_PILL = "COLOURED_PILL",
  COLOURED_PILL_LIST = "COLOURED_PILL_LIST",
  PERCENTAGE = "PERCENTAGE",
  DATE = "DATE"
}

export interface DataTableColumnConfigurationEntryBase {
  fieldName: string;
  label: string;
  isHideable: boolean;
  isFixed: boolean;
}

export type StandardDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.STANDARD;
}

export type LinkDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.LINK;
}

type LinkButtonDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.LINK_BUTTON;
}

type ColouredPillDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL;
  colourSchemeClassname: string;
}

export type ColouredPillListDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST;
  valueToColourSchemeClassnameMap: Record<string, string | unknown>;
  defaultColourSchemeClassname: string;
}

export type PercentageDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE;
}

export type DateDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.DATE;
}

export type DataTableColumnConfigurationEntry = 
  | StandardDataTableColumnConfigurationEntry
  | LinkDataTableColumnConfigurationEntry
  | LinkButtonDataTableColumnConfigurationEntry
  | ColouredPillDataTableColumnConfigurationEntry
  | ColouredPillListDataTableColumnConfigurationEntry
  | PercentageDataTableColumnConfigurationEntry
  | DateDataTableColumnConfigurationEntry;

interface ColumnConfigurationToColumnDefinitionInput {
  columnConfiguration: Array<DataTableColumnConfigurationEntry>
}

export const columnConfigurationToColumnDefinitions = (
  input: ColumnConfigurationToColumnDefinitionInput
): Array<DataTableColumnDef<Record<string, unknown>, unknown>> => {
  return input.columnConfiguration
    .map((columnConfigurationEntry) => {
      if(columnConfigurationEntry.type === DataTableColumnConfigurationEntryType.STANDARD) {
        return getDataTableStandardColumnConfiguration({columnConfiguration: columnConfigurationEntry});
      }
      if(columnConfigurationEntry.type === DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST) {
        return getDataTableColouredPillListColumnConfiguration({columnConfiguration: columnConfigurationEntry});
      }
      if(columnConfigurationEntry.type === DataTableColumnConfigurationEntryType.DATE) {
        return getDataTableDateColumnConfiguration({columnConfiguration: columnConfigurationEntry});
      }
      if(columnConfigurationEntry.type === DataTableColumnConfigurationEntryType.PERCENTAGE) {
        return getDataTablePercentageColumnConfiguration({columnConfiguration: columnConfigurationEntry});
      }
    })
    .filter(<T extends unknown>(element: T | undefined): element is T => !!element)
}