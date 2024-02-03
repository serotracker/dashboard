import { typedGroupBy } from "@/lib/utils";

interface GetNumberOfUniqueValuesForField<TFieldName extends string> {
  fieldName: TFieldName;
  filteredData: Record<TFieldName, string>[];
}


export const useArboDataInsights = () => {
  const getNumberOfUniqueValuesForField = <TFieldName extends string>(input: GetNumberOfUniqueValuesForField<TFieldName>) => {
    return Object.keys(typedGroupBy(input.filteredData, (dataPoint) => dataPoint[input.fieldName])).length;
  }

  return {
    getNumberOfUniqueValuesForField
  }
}