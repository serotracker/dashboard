import { Month } from "@/gql/graphql";

export const monthNumberToMonth: Record<number, string | undefined> = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
}

export const monthToMonthNumber: Record<string, number | undefined> = {
  'Jan': 0,
  'Feb': 1,
  'Mar': 2,
  'Apr': 3,
  'May': 4,
  'Jun': 5,
  'Jul': 6,
  'Aug': 7,
  'Sep': 8,
  'Oct': 9,
  'Nov': 10,
  'Dec': 11,
}

export const monthCountToMonthYearString = (monthCount: number): string => {
  const year = Math.floor(monthCount / 12);
  const monthNumber = monthCount % 12;
  const month = monthNumberToMonth[monthNumber] ?? 'UNKNOWN';

  return `${month} ${year}`;
}

export const monthYearStringToMonthCount = (monthCountString: string): number => {
  const month = monthToMonthNumber[monthCountString.slice(0,3)] ?? 0
  const year = parseInt(monthCountString.slice(4,8))

  return (year * 12) + month;
}

export const dateToMonthCount = (date: Date): number => {
  return (date.getFullYear() * 12) + date.getMonth();
}

export const monthCountToDate = (monthCount: number): Date => {
  return new Date(Math.floor(monthCount / 12), monthCount % 12, 1, 0, 0, 0, 0);
}

export const dateToDayCount = (date: Date): number => {
  // valueOf is milliseconds since unix epoch. 1000ms per 1s, 60s per 1h, 24h per 1day
  return Math.floor((((date.valueOf() / 1000) / 60) / 24));
}

export const dayCountToDate = (dayCount: number): Date => {
  //1000ms per 1s, 60s per 1h, 24h per 1day
  return new Date(dayCount * 1000 * 60 * 24);
}

interface DateFromYearAndMonthInput {
  year: number;
  month: Month;
}

export const monthIndexFromMonthMap = {
  [Month.January]: 0,
  [Month.February]: 1,
  [Month.March]: 2,
  [Month.April]: 3,
  [Month.May]: 4,
  [Month.June]: 5,
  [Month.July]: 6,
  [Month.August]: 7,
  [Month.September]: 8,
  [Month.October]: 9,
  [Month.November]: 10,
  [Month.December]: 11
}

export const dateFromYearAndMonth = (input: DateFromYearAndMonthInput): Date => {
  return new Date(input.year, monthIndexFromMonthMap[input.month]);
}