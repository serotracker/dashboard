import { DataTableColumnDef } from "./data-table";
import { getDataTableStandardColumnConfiguration } from "./data-table-column-configurations/data-table-standard-column-configuration";

export enum DataTableColumnConfigurationEntryType {
  STANDARD = "STANDARD",
  LINK = "LINK",
  LINK_BUTTON = "LINK_BUTTON",
  COLOURED_PILL = "COLOURED_PILL",
  COLOURED_PILL_LIST = "COLOURED_PILL_LIST",
  PERCENTAGE = "PERCENTAGE",
  DATE = "DATE",
  CUSTOM = "CUSTOM",
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

const isStandardDataTableColumnConfigurationEntry = (configurationEntry: DataTableColumnConfigurationEntry):
  configurationEntry is StandardDataTableColumnConfigurationEntry => configurationEntry.type === DataTableColumnConfigurationEntryType.STANDARD;

export type LinkDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.LINK;
}

const isLinkDataTableColumnConfigurationEntry = (configurationEntry: DataTableColumnConfigurationEntry):
  configurationEntry is LinkDataTableColumnConfigurationEntry => configurationEntry.type === DataTableColumnConfigurationEntryType.LINK;

type LinkButtonDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.LINK_BUTTON;
}

type ColouredPillDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL;
  colour: string;
}

type ColouredPillListDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST;
  valueToColourMap: Record<string, string | unknown>;
}

type PercentageDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE;
}

type DateDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.DATE;
}

type CustomDataTableColumnConfigurationEntry = DataTableColumnConfigurationEntryBase & {
  type: DataTableColumnConfigurationEntryType.CUSTOM;
}

export type DataTableColumnConfigurationEntry = 
  | StandardDataTableColumnConfigurationEntry
  | LinkDataTableColumnConfigurationEntry
  | LinkButtonDataTableColumnConfigurationEntry
  | ColouredPillDataTableColumnConfigurationEntry
  | ColouredPillListDataTableColumnConfigurationEntry
  | PercentageDataTableColumnConfigurationEntry
  | DateDataTableColumnConfigurationEntry
  | CustomDataTableColumnConfigurationEntry;

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
    })
    .filter(<T extends unknown>(element: T | undefined): element is T => !!element)
}