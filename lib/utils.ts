import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import groupBy from 'lodash/groupBy'
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const typedObjectEntries = <TKey extends string, TValue>(input: Record<TKey, TValue>): [TKey, TValue][] => {
  return Object.entries(input) as [TKey, TValue][];
}

export const typedObjectFromEntries = <TKey extends string, TValue>(input: [TKey, TValue][]): Record<TKey, TValue> => {
  return Object.fromEntries(input) as Record<TKey, TValue>;
}

export const typedGroupBy = <TKey extends string, TValue>(values: TValue[], groupingFunction: (value: TValue) => TKey): Record<TKey, TValue[]> => {
  return groupBy(values, groupingFunction) as Record<TKey, TValue[]>
}

export const typedObjectKeys = <TKey extends string>(input: Record<TKey, unknown>): Array<TKey> => {
  return Object.keys(input) as TKey[];
}