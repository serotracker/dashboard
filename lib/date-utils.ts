import { isBefore } from "date-fns";

export type TimeInterval = { intervalStartDate: Date | undefined; intervalEndDate: Date | undefined };
export type FullyBoundedTimeInterval = { intervalStartDate: Date; intervalEndDate: Date };

export const doTimeIntervalsOverlap = (
  intervalA: TimeInterval,
  intervalB: TimeInterval
): boolean => {
  return (
    (!intervalB.intervalEndDate || !intervalA.intervalStartDate || isBefore(intervalA.intervalStartDate, intervalB.intervalEndDate)) &&
    (!intervalA.intervalEndDate || !intervalB.intervalStartDate || isBefore(intervalB.intervalStartDate, intervalA.intervalEndDate))
  );
};
