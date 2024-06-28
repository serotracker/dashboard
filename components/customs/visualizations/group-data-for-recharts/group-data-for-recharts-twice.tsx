import {
  typedGroupBy,
  typedObjectEntries,
  typedObjectFromEntries,
  typedObjectKeys,
} from "@/lib/utils";
import { groupDataForRechartsOnce } from "./group-data-for-recharts-once";

export interface DoubleGroupingTransformOutputValueInput<
  TData,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
> {
  data: TData[];
  secondaryGroupingKey: TSecondaryGroupingKey;
}

interface GroupDataForRechartsTwiceInput<
  TData,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">,
  TOutput
> {
  data: TData[];
  primaryGroupingFunction: (data: TData) => TPrimaryGroupingKey | TPrimaryGroupingKey[];
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  secondaryGroupingFunction: (data: TData) => TSecondaryGroupingKey | TSecondaryGroupingKey[];
  secondaryGroupingSortFunction?: (
    a: TSecondaryGroupingKey,
    b: TSecondaryGroupingKey
  ) => number;
  transformOutputValue: (input: DoubleGroupingTransformOutputValueInput<
    TData,
    TSecondaryGroupingKey
  >) => TOutput;
}

interface GroupDataForRechartsTwiceOutput<
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">,
  TOutput
> {
  rechartsData: ({ primaryKey: TPrimaryGroupingKey } & Record<
    TSecondaryGroupingKey,
    TOutput
  >)[];
  allSecondaryKeys: TSecondaryGroupingKey[];
}

export const groupDataForRechartsTwice = <
  TData,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">,
  TOutput
>(
  input: GroupDataForRechartsTwiceInput<
    TData,
    TPrimaryGroupingKey,
    TSecondaryGroupingKey,
    TOutput
  >
): GroupDataForRechartsTwiceOutput<TPrimaryGroupingKey, TSecondaryGroupingKey, TOutput> => {
  const {
    allPrimaryKeys: sortedPrimaryKeys,
    rechartsData: dataGroupedByPrimaryKey,
  } = groupDataForRechartsOnce({
    data: input.data,
    primaryGroupingFunction: input.primaryGroupingFunction,
    primaryGroupingSortFunction: input.primaryGroupingSortFunction,
    transformOutputValue: (({ data }) => data)
  })

  const allSecondaryKeys = new Set<TSecondaryGroupingKey>();

  const rechartsData = sortedPrimaryKeys.map((primaryKey) => {
    const dataForPrimaryKey = dataGroupedByPrimaryKey[primaryKey];

    const dataWithSecondaryKeys = dataForPrimaryKey
      .map((dataPoint) => ({
        dataPoint: dataPoint,
        secondaryKey: input.secondaryGroupingFunction(dataPoint)
      }))
      .flatMap(({ dataPoint, secondaryKey }) => 
        Array.isArray(secondaryKey)
          ? secondaryKey.map((elementInSecondaryKey) => ({dataPoint: dataPoint, secondaryKey: elementInSecondaryKey}))
          :[{dataPoint: dataPoint, secondaryKey: secondaryKey}]
      )

    const dataGroupedBySecondaryKey = typedGroupBy(
      dataWithSecondaryKeys,
      ({secondaryKey}) => secondaryKey
    );

    const allSecondaryKeysForPrimaryKey = typedObjectKeys(
      dataGroupedBySecondaryKey
    );

    allSecondaryKeysForPrimaryKey.forEach((secondaryKey) => {
      allSecondaryKeys.add(secondaryKey);
    });

    const valuesGroupedBySecondaryKey = typedObjectFromEntries(
      typedObjectEntries(dataGroupedBySecondaryKey).map(
        ([secondaryKey, dataForSecondaryKey]) => [
          secondaryKey,
          input.transformOutputValue({
            data: dataForSecondaryKey.map(({dataPoint}) => dataPoint),
            secondaryGroupingKey: secondaryKey
          }),
        ]
      )
    );

    return {
      primaryKey,
      ...valuesGroupedBySecondaryKey,
    };
  });

  const allSecondaryKeysSorted = input.secondaryGroupingSortFunction
    ? Array.from(allSecondaryKeys).sort(input.secondaryGroupingSortFunction)
    : Array.from(allSecondaryKeys);

  return {
    rechartsData,
    allSecondaryKeys: allSecondaryKeysSorted,
  };
};
