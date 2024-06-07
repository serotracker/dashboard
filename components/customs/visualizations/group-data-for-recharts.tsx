import {
  typedGroupBy,
  typedObjectEntries,
  typedObjectFromEntries,
  typedObjectKeys,
} from "@/lib/utils";

export interface TransformOutputValueInput<
  TData,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
> {
  data: TData[];
  secondaryGroupingKey: TSecondaryGroupingKey;
}

interface GroupDataForRechartsInput<
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
  transformOutputValue: (input: TransformOutputValueInput<
    TData,
    TSecondaryGroupingKey
  >) => TOutput;
}

interface GroupDataForRechartsOutput<
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

export const groupDataForRecharts = <
  TData,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">,
  TOutput
>(
  input: GroupDataForRechartsInput<
    TData,
    TPrimaryGroupingKey,
    TSecondaryGroupingKey,
    TOutput
  >
): GroupDataForRechartsOutput<TPrimaryGroupingKey, TSecondaryGroupingKey, TOutput> => {
  const dataWithPrimaryKeys = input.data
    .map((dataPoint) => ({
      dataPoint: dataPoint,
      primaryKey: input.primaryGroupingFunction(dataPoint)
    }))
    .flatMap(({dataPoint, primaryKey}) => 
      Array.isArray(primaryKey)
        ? primaryKey.map((elementInPrimaryKey) => ({dataPoint: dataPoint, primaryKey: elementInPrimaryKey}))
        :[{dataPoint: dataPoint, primaryKey: primaryKey}]
    )

  const dataGroupedByPrimaryKey = typedGroupBy(
    dataWithPrimaryKeys,
    (({primaryKey}) => primaryKey)
  );

  const allPrimaryKeys = typedObjectKeys(dataGroupedByPrimaryKey);

  const sortedPrimaryKeys = input.primaryGroupingSortFunction
    ? allPrimaryKeys.sort(input.primaryGroupingSortFunction)
    : allPrimaryKeys;

  const allSecondaryKeys = new Set<TSecondaryGroupingKey>();

  const rechartsData = sortedPrimaryKeys.map((primaryKey) => {
    const dataForPrimaryKey = dataGroupedByPrimaryKey[primaryKey];

    const dataWithSecondaryKeys = dataForPrimaryKey
      .map(({ dataPoint }) => ({
        dataPoint: dataPoint,
        secondaryKey: input.secondaryGroupingFunction(dataPoint)
      }))
      .flatMap(({dataPoint, secondaryKey}) => 
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
