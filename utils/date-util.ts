import { parse } from "date-fns";

export const parseDateString = (date: string): Date | undefined => {
  if(/^(\d){4}-(\d){2}-(\d){2}$/.test(date)) {
    return parse(date, "yyyy-MM-dd", new Date());
  }
  
  if(/^(\d){2}\/(\d){2}\/(\d){4}$/.test(date)) {
    return parse(date, "dd/MM/yyyy", new Date());
  }
  
  return;
}