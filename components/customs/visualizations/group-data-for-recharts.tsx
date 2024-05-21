import {
  typedGroupBy,
  typedObjectEntries,
  typedObjectFromEntries,
  typedObjectKeys,
} from "@/lib/utils";

interface GroupDataForRechartsInput<
  TData,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">,
  TOutput
> {
  data: TData[];
  primaryGroupingFunction: (data: TData) => TPrimaryGroupingKey;
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  secondaryGroupingFunction: (data: TData) => TSecondaryGroupingKey;
  secondaryGroupingSortFunction?: (
    a: TSecondaryGroupingKey,
    b: TSecondaryGroupingKey
  ) => number;
  transformOutputValue: (data: TData[]) => TOutput;
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
  const dataGroupedByPrimaryKey = typedGroupBy(
    input.data,
    input.primaryGroupingFunction
  );

  const allPrimaryKeys = typedObjectKeys(dataGroupedByPrimaryKey);

  const sortedPrimaryKeys = input.primaryGroupingSortFunction
    ? allPrimaryKeys.sort(input.primaryGroupingSortFunction)
    : allPrimaryKeys;

  const allSecondaryKeys = new Set<TSecondaryGroupingKey>();

  const rechartsData = sortedPrimaryKeys.map((primaryKey) => {
    const dataForPrimaryKey = dataGroupedByPrimaryKey[primaryKey];

    const dataGroupedBySecondaryKey = typedGroupBy(
      dataForPrimaryKey,
      input.secondaryGroupingFunction
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
          input.transformOutputValue(dataForSecondaryKey),
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
