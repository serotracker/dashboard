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

interface MixColoursInput {
  zeroValuedColourHexCode: string;
  oneValuedColourHexCode: string;
  value: number
}

export const mixColours = (input: MixColoursInput): string => {
  const zeroValuedColourRGB = [
    parseInt(input.zeroValuedColourHexCode.substring(1,3), 16),
    parseInt(input.zeroValuedColourHexCode.substring(3,5), 16),
    parseInt(input.zeroValuedColourHexCode.substring(5,7), 16)
  ];
  const oneValuedColourRGB = [
    parseInt(input.oneValuedColourHexCode.substring(1,3), 16),
    parseInt(input.oneValuedColourHexCode.substring(3,5), 16),
    parseInt(input.oneValuedColourHexCode.substring(5,7), 16)
  ];

  const mixedColourRGB = [
    Math.round((oneValuedColourRGB[0] * input.value) + (zeroValuedColourRGB[0] * (1 - input.value))),
    Math.round((oneValuedColourRGB[1] * input.value) + (zeroValuedColourRGB[1] * (1 - input.value))),
    Math.round((oneValuedColourRGB[2] * input.value) + (zeroValuedColourRGB[2] * (1 - input.value)))
  ]

  return `#${mixedColourRGB[0].toString(16)}${mixedColourRGB[1].toString(16)}${mixedColourRGB[2].toString(16)}`
}

interface GenerateRandomIntegerInput {
  maximumValueNonInclusive: number;
}

const generateRandomInteger = (input: GenerateRandomIntegerInput): number => {
  return Math.floor(Math.random() * input.maximumValueNonInclusive);
}

const generateRandomRGBValue = (): string => {
  return generateRandomInteger({ maximumValueNonInclusive: 256 })
    .toString(16)
    .padStart(2, '0');
}

export const generateRandomColour = (): string => [1,2,3].map(() => `${generateRandomRGBValue()}`).join('')