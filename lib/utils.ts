import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const typedObjectEntries = <TKey extends string, TValue>(input: Record<TKey, TValue>): [TKey, TValue][] => {
  return Object.entries(input) as [TKey, TValue][];
}