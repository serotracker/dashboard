import { assertNever } from 'assert-never';
import { DataTableColumnDef } from "./data-table";
import { getDataTableColouredPillColumnConfiguration } from "./data-table-column-configurations/data-table-coloured-pill-column-configuration";
import { getDataTableColouredPillListColumnConfiguration } from "./data-table-column-configurations/data-table-coloured-pill-list-column-configuration";
import { getDataTableDateColumnConfiguration } from "./data-table-column-configurations/data-table-date-column-configuration";
import { getDataTableLinkButtonColumnConfiguration } from "./data-table-column-configurations/data-table-link-button-column-configuration";
import { getDataTableLinkColumnConfiguration } from "./data-table-column-configurations/data-table-link-column-configuration";
import { getDataTableStandardColumnConfiguration } from "./data-table-column-configurations/data-table-standard-column-configuration";
import { getDataTablePercentageColumnConfiguration } from "./data-table-column-configurations/date-table-percentage-column-configuration";
import { getDataTableBooleanColumnConfiguration } from './data-table-column-configurations/data-table-boolean-column-configuration';

export enum DataTableColumnConfigurationEntryType {
  STANDARD = "STANDARD",
  LINK = "LINK",
  LINK_BUTTON = "LINK_BUTTON",
  COLOURED_PILL = "COLOURED_PILL",
  COLOURED_PILL_LIST = "COLOURED_PILL_LIST",
  PERCENTAGE = "PERCENTAGE",
  BOOLEAN = "BOOLEAN",
  DATE = "DATE"
}

export interface DataTableColumnConfigurationEntryBase {
  fieldName: string;
  label: string;
  isSortable?: boolean;
  isHideable?: boolean;
  isFixed?: boolean;
}

export type StandardDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.STANDARD;
}

export type LinkDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.LINK;
  fieldNameForLink: string;
}

export type LinkButtonDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.LINK_BUTTON;
  fieldNameForLink: string;
}

export type ColouredPillDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL;
  valueToColourSchemeClassnameMap: Record<string, string | unknown>;
  defaultColourSchemeClassname: string;
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

export type BooleanDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.BOOLEAN;
}

export type DataTableColumnConfigurationEntry = 
  | StandardDataTableColumnConfigurationEntry
  | LinkDataTableColumnConfigurationEntry
  | LinkButtonDataTableColumnConfigurationEntry
  | ColouredPillDataTableColumnConfigurationEntry
  | ColouredPillListDataTableColumnConfigurationEntry
  | PercentageDataTableColumnConfigurationEntry
  | DateDataTableColumnConfigurationEntry
  | BooleanDataTableColumnConfigurationEntry;

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
      if(columnConfigurationEntry.type === DataTableColumnConfigurationEntryType.COLOURED_PILL) {
        return getDataTableColouredPillColumnConfiguration({columnConfiguration: columnConfigurationEntry});
      }
      if(columnConfigurationEntry.type === DataTableColumnConfigurationEntryType.LINK) {
        return getDataTableLinkColumnConfiguration({columnConfiguration: columnConfigurationEntry});
      }
      if(columnConfigurationEntry.type === DataTableColumnConfigurationEntryType.LINK_BUTTON) {
        return getDataTableLinkButtonColumnConfiguration({columnConfiguration: columnConfigurationEntry});
      }
      if(columnConfigurationEntry.type === DataTableColumnConfigurationEntryType.DATE) {
        return getDataTableDateColumnConfiguration({columnConfiguration: columnConfigurationEntry});
      }
      if(columnConfigurationEntry.type === DataTableColumnConfigurationEntryType.PERCENTAGE) {
        return getDataTablePercentageColumnConfiguration({columnConfiguration: columnConfigurationEntry});
      }
      if(columnConfigurationEntry.type === DataTableColumnConfigurationEntryType.BOOLEAN) {
        return getDataTableBooleanColumnConfiguration({columnConfiguration: columnConfigurationEntry});
      }

      assertNever(columnConfigurationEntry);
    })
    .filter(<T extends unknown>(element: T | undefined): element is T => !!element)
}