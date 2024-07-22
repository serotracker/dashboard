import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import groupBy from 'lodash/groupBy'
import defaultColours from 'tailwindcss/colors'
 
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

interface GenerateRangeInput {
  startInclusive: number,
  endInclusive: number,
  stepSize: number
}

export const generateRange = (input: GenerateRangeInput) =>
  Array.from({ length: (input.endInclusive - input.startInclusive) / input.stepSize + 1 }, (_, i) => input.startInclusive + i * input.stepSize);

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

export const generateRandomColour = (): string => `#${[1,2,3].map(() => `${generateRandomRGBValue()}`).join('')}`

export const distinctColoursMap: Record<number, string | undefined> = {
  0: defaultColours.red[200],
  1: defaultColours.red[500],
  2: defaultColours.red[800],
  3: defaultColours.emerald[200],
  4: defaultColours.emerald[500],
  5: defaultColours.emerald[800],
  6: defaultColours.purple[200],
  7: defaultColours.purple[500],
  8: defaultColours.purple[800],
  9: defaultColours.yellow[200],
  10: defaultColours.yellow[500],
  11: defaultColours.yellow[800],
  12: defaultColours.blue[200],
  13: defaultColours.blue[500],
  14: defaultColours.blue[800],
  15: defaultColours.rose[200],
  16: defaultColours.rose[500],
  17: defaultColours.rose[800],
  18: defaultColours.orange[200],
  19: defaultColours.orange[500],
  20: defaultColours.orange[800],
  21: defaultColours.lime[200],
  22: defaultColours.lime[500],
  23: defaultColours.lime[800],
  24: defaultColours.cyan[200],
  25: defaultColours.cyan[500],
  26: defaultColours.cyan[800],
  27: defaultColours.amber[200],
  28: defaultColours.amber[500],
  29: defaultColours.amber[800],
  30: defaultColours.teal[200],
  31: defaultColours.teal[500],
  32: defaultColours.teal[800]
};

export const groupByArray = <TGroupingKey extends string, TGroupingValue extends string, TValue extends Record<TGroupingKey, TGroupingValue>>(values: TValue[], groupingKey: TGroupingKey): Array<Record<TGroupingKey, TGroupingValue> & {data: Omit<TValue, TGroupingKey>[]}> => {
  const valueToGroupingValue = (value: TValue): TGroupingValue => {
    return value[groupingKey]
  }

  const groupByWithRecords = typedGroupBy(values, valueToGroupingValue);
  return typedObjectKeys(groupByWithRecords).map((groupingValue) => {
    const groupingKeyAndValue = {
      [groupingKey]: groupingValue
    } as Record<TGroupingKey, TGroupingValue>

    const groupedData = groupByWithRecords[groupingValue]

    return {
      ...groupingKeyAndValue,
      data: groupedData.map((dataPoint) => {
        const {[groupingKey]: a, ...dataPointWithoutGroupingKey} = dataPoint;

        return dataPointWithoutGroupingKey;
      })
    }
  })
}