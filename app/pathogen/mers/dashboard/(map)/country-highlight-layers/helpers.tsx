import { assertNever } from "assert-never";
import { MapDataPointVisibilityOptions } from "../use-mers-map-customization-modal";

const formatNumberForLegend = (input: {
  value: number,
  isExclusiveInRange: boolean;
}): string => {
  const adjustmentAmount = input.isExclusiveInRange ? 0.01 : 0;

  if(input.value / 1_000_000_000 >= 1) {
    return `${((input.value / 1_000_000_000) - adjustmentAmount).toFixed(2)} billion`
  }

  if(input.value / 1_000_000 >= 1) {
    return `${((input.value / 1_000_000) - adjustmentAmount).toFixed(2)} million`
  }

  if(input.value / 1_000 >= 1) {
    return `${Math.floor(input.value / 1_000)}'${input.value.toFixed(0).slice(-3)}`
  }

  return input.value.toFixed(0)
}

export const formatNumberRangeForLegend = (input: {
  minimumInclusive: number | undefined,
  maximumExclusive: number | undefined,
}): string => {
  const formattedMinimum = input.minimumInclusive ? formatNumberForLegend({ value: input.minimumInclusive, isExclusiveInRange: false }) : undefined;
  const formattedMaximum = input.maximumExclusive ? formatNumberForLegend({ value: input.maximumExclusive, isExclusiveInRange: true }) : undefined;

  if(formattedMinimum !== undefined && formattedMaximum !== undefined) {
    return `${formattedMinimum} to ${formattedMaximum}`;
  }

  if(formattedMinimum === undefined && formattedMaximum !== undefined) {
    return `Up to ${formattedMaximum}`;
  }

  if(formattedMinimum !== undefined && formattedMaximum === undefined) {
    return `Over ${formattedMinimum}`;
  }

  return "-";
}

export const formatPerCapitaNumberForLegend = (input: {
  value: number;
  isExclusiveInRange: boolean;
  entity: string;
}): string => {
  const adjustmentAmount = input.isExclusiveInRange ? 1 : 0;

  if(input.value * 1_000 >= 1) {
    return `${((input.value * 1_000) - adjustmentAmount).toFixed(0)} ${input.entity} per 1'000 people`
  }

  if(input.value * 1_000_000 >= 1) {
    return `${((input.value * 1_000_000) - adjustmentAmount).toFixed(0)} ${input.entity} per million people`
  }

  if(input.value * 1_000_000_000 >= 1) {
    return `${((input.value * 1_000_000_000) - adjustmentAmount).toFixed(0)} ${input.entity} per billion people`
  }

  return input.value.toFixed(0)
}

export const formatPerCapitaNumberRangeForLegend = (input: {
  minimumInclusive: number | undefined,
  maximumExclusive: number | undefined,
  entity: string
}): string => {
  const formattedMinimum = input.minimumInclusive ? formatPerCapitaNumberForLegend({ value: input.minimumInclusive, entity: input.entity, isExclusiveInRange: false }) : undefined;
  const formattedMaximum = input.maximumExclusive ? formatPerCapitaNumberForLegend({ value: input.maximumExclusive, entity: input.entity, isExclusiveInRange: true }) : undefined;

  if(formattedMinimum !== undefined && formattedMaximum !== undefined) {
    return `${formattedMinimum} to ${formattedMaximum}`;
  }

  if(formattedMinimum === undefined && formattedMaximum !== undefined) {
    return `Up to ${formattedMaximum}`;
  }

  if(formattedMinimum !== undefined && formattedMaximum === undefined) {
    return `Over ${formattedMinimum}`;
  }

  return "-";
}

interface StandardGetFreeTextEntriesFunctionInput {
  countryOutlinesEnabled: boolean;
  mapDataPointVisibilitySetting: MapDataPointVisibilityOptions;
}

export const standardGetFreeTextEntriesFunction = (input: StandardGetFreeTextEntriesFunctionInput) => {
  const { countryOutlinesEnabled, mapDataPointVisibilitySetting } = input;

  if(!countryOutlinesEnabled || mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.NOTHING_VISIBLE) {
    return [];
  }

  if(mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.ESTIMATES_ONLY) {
    return [
      { text: 'Countries with a black outline contain seroprevalence data.' }
    ];
  }

  if(mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_ONLY) {
    return [
      { text: 'Countries with a black outline contain MERS events.' }
    ];
  }

  if(mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE) {
    return [
      { text: 'Countries with a black outline contain seroprevalence data or MERS events.' }
    ];
  }

  assertNever(mapDataPointVisibilitySetting)
}