import { typedObjectFromEntries, typedObjectKeys } from "@/lib/utils";

interface ApplyLabelsToGroupedRechartsDataInput<
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

interface ApplyLabelsToGroupedRechartsDataOutput<
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

export const applyLabelsToGroupedRechartsData = <
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">,
  TPrimaryGroupingKeyLabel extends string,
  TSecondaryGroupingKeyLabel extends string
>(input: ApplyLabelsToGroupedRechartsDataInput<
  TPrimaryGroupingKey,
  TSecondaryGroupingKey,
  TPrimaryGroupingKeyLabel,
  TSecondaryGroupingKeyLabel
>): ApplyLabelsToGroupedRechartsDataOutput<
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