import { typedObjectEntries, typedObjectFromEntries, typedObjectKeys } from "@/lib/utils";

interface ApplyLabelsToSinglyGroupedRechartsDataInput<
  TPrimaryGroupingKey extends string,
  TPrimaryGroupingKeyLabel extends string,
  TData
> {
  rechartsData: Record<TPrimaryGroupingKey, TData>
  primaryGroupingKeyToLabel?: (input: TPrimaryGroupingKey) => TPrimaryGroupingKeyLabel;
}

interface ApplyLabelsToSinglyGroupedRechartsDataOutput<
  TPrimaryGroupingKeyLabel extends string,
  TData
> {
  rechartsDataUsingLabels: Record<TPrimaryGroupingKeyLabel, TData>
}

export const applyLabelsToSinglyGroupedRechartsData = <
  TPrimaryGroupingKey extends string,
  TPrimaryGroupingKeyLabel extends string,
  TData
>(input: ApplyLabelsToSinglyGroupedRechartsDataInput<
  TPrimaryGroupingKey,
  TPrimaryGroupingKeyLabel,
  TData
>): ApplyLabelsToSinglyGroupedRechartsDataOutput<
  TPrimaryGroupingKeyLabel,
  TData
> => {
  return {
    rechartsDataUsingLabels: typedObjectFromEntries(
      typedObjectEntries(input.rechartsData)
        .map(([key, value]) => [
          input.primaryGroupingKeyToLabel ? input.primaryGroupingKeyToLabel(key) : key,
          value
        ])
    )
  }
}

interface ApplyLabelsToDoublyGroupedRechartsDataInput<
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">,
  TPrimaryGroupingKeyLabel extends string,
  TSecondaryGroupingKeyLabel extends string
> {
  rechartsData: ({ primaryKey: TPrimaryGroupingKey } & Record<
    TSecondaryGroupingKey,
    number
  >)[];
  primaryGroupingKeyToLabel?: (input: TPrimaryGroupingKey) => TPrimaryGroupingKeyLabel;
  secondaryGroupingKeyToLabel?: (input: TSecondaryGroupingKey) => TSecondaryGroupingKeyLabel;
}

interface ApplyLabelsToDoublyGroupedRechartsDataOutput<
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">,
  TPrimaryGroupingKeyLabel extends string,
  TSecondaryGroupingKeyLabel extends string
> {
  rechartsDataUsingLabels: ({ primaryKey: TPrimaryGroupingKeyLabel | TPrimaryGroupingKey } & Record<
    TSecondaryGroupingKeyLabel | TSecondaryGroupingKey,
    number | undefined
  >)[];
}

export const applyLabelsToDoublyGroupedRechartsData = <
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">,
  TPrimaryGroupingKeyLabel extends string,
  TSecondaryGroupingKeyLabel extends string
>(input: ApplyLabelsToDoublyGroupedRechartsDataInput<
  TPrimaryGroupingKey,
  TSecondaryGroupingKey,
  TPrimaryGroupingKeyLabel,
  TSecondaryGroupingKeyLabel
>): ApplyLabelsToDoublyGroupedRechartsDataOutput<
  TPrimaryGroupingKey,
  TSecondaryGroupingKey,
  TPrimaryGroupingKeyLabel,
  TSecondaryGroupingKeyLabel
> => {
  return {
    rechartsDataUsingLabels: input.rechartsData.map((dataPoint) => (
      Object.fromEntries(typedObjectKeys(dataPoint).map((dataPointKey) => {
        if(dataPointKey === 'primaryKey') {
          return ['primaryKey', input.primaryGroupingKeyToLabel ? input.primaryGroupingKeyToLabel(dataPoint['primaryKey']) : dataPoint['primaryKey']]
        }

        return [input.secondaryGroupingKeyToLabel ? input.secondaryGroupingKeyToLabel(dataPointKey) : dataPointKey, dataPoint[dataPointKey]]
      }))
    ))
  }
}