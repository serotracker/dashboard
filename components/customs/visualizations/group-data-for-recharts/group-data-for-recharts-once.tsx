import {
  typedGroupBy,
  typedObjectEntries,
  typedObjectFromEntries,
  typedObjectKeys,
} from "@/lib/utils";

export interface SingleGroupingTransformOutputValueInput<
  TData,
  TPrimaryGroupingKey extends string
> {
  data: TData[];
  primaryGroupingKey: TPrimaryGroupingKey;
}

interface GroupDataForRechartsOnceInput<
  TData,
  TPrimaryGroupingKey extends string,
  TOutput
> {
  data: TData[];
  primaryGroupingFunction: (data: TData) => TPrimaryGroupingKey | TPrimaryGroupingKey[];
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  transformOutputValue: (input: SingleGroupingTransformOutputValueInput<
    TData,
    TPrimaryGroupingKey
  >) => TOutput;
}

interface GroupDataForRechartsOnceOutput<
  TPrimaryGroupingKey extends string,
  TOutput
> {
  rechartsData: Record<TPrimaryGroupingKey, TOutput>;
  allPrimaryKeys: TPrimaryGroupingKey[];
}

export const groupDataForRechartsOnce = <
  TData,
  TPrimaryGroupingKey extends string,
  TOutput
>(
  input: GroupDataForRechartsOnceInput<
    TData,
    TPrimaryGroupingKey,
    TOutput
  >
): GroupDataForRechartsOnceOutput<TPrimaryGroupingKey, TOutput> => {
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

  const rechartsData = typedObjectFromEntries(
    typedObjectEntries(dataGroupedByPrimaryKey)
      .map(([key, value]) => [
        key,
        input.transformOutputValue({
          data: value.map(({ dataPoint }) => dataPoint),
          primaryGroupingKey: key
        })
      ])
  )

  return {
    rechartsData,
    allPrimaryKeys: sortedPrimaryKeys,
  };
};
