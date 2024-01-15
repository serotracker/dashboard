export const typedObjectFromEntries = <TKey extends string, TValue>(
  input: [TKey, TValue][]
): Record<TKey, TValue> => {
  return Object.fromEntries(input) as Record<TKey, TValue>;
};
