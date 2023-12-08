import { parse, format } from "date-fns";

export const parseDateString = (date: string): Date | undefined => {
  if(/^(\d){4}-(\d){2}-(\d){2}$/.test(date)) {
    return parse(date, "yyyy-MM-dd", new Date());
  }

  return;
}

export const formatDateToString = (date: Date): string => {
  return format(date, "yyyy-MM-dd")
}