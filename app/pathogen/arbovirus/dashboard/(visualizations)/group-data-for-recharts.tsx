import {
  typedGroupBy,
  typedObjectEntries,
  typedObjectFromEntries,
  typedObjectKeys,
} from "@/lib/utils";

interface GroupDataForRechartsInput<
  TData,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
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
  getBarValue: (data: TData[]) => number;
}

interface GroupDataForRechartsOutput<
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
> {
  rechartsData: ({ primaryKey: TPrimaryGroupingKey } & Record<
    TSecondaryGroupingKey,
    number
  >)[];
  allSecondaryKeys: TSecondaryGroupingKey[];
}

export const groupDataForRecharts = <
  TData,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
>(
  input: GroupDataForRechartsInput<
    TData,
    TPrimaryGroupingKey,
    TSecondaryGroupingKey
  >
): GroupDataForRechartsOutput<TPrimaryGroupingKey, TSecondaryGroupingKey> => {
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
          input.getBarValue(dataForSecondaryKey),
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
