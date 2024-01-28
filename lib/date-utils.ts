import { isBefore } from "date-fns";

export type TimeInterval = { intervalStartDate: Date; intervalEndDate: Date };

export const doTimeIntervalsOverlap = (
  intervalA: TimeInterval,
  intervalB: TimeInterval
): boolean => {
  return (
    isBefore(intervalA.intervalStartDate, intervalB.intervalEndDate) &&
    isBefore(intervalB.intervalStartDate, intervalA.intervalEndDate)
  );
};
