import {
  HandleArboFilterUpdateInput,
  HandleArboFilterUpdateOutput,
} from "../arbo-filter-update-steps";

export function filterData(
  data: any[],
  filters: { [key: string]: string[] }
): any[] {
  const filterKeys = Object.keys(filters);

  return data.filter((item: any) => {
    return filterKeys.every((key: string) => {
      if (!filters[key].length) return true;

      if (key === "end_date") {
        const filterEndDate = new Date(filters["end_date"][0]);
        const filterStartDate = new Date(filters["start_date"][0]);

        if (isNaN(filterEndDate.getTime())) {
          return true; // Handle invalid date
        }

        const itemStartDate = new Date(item.sampleStartDate);
        const itemEndDate = new Date(item.sampleEndDate);

        // Check for any overlap in the sampling period
        return (
          itemEndDate <= filterEndDate ||
          (itemEndDate >= filterEndDate && itemStartDate < filterEndDate)
        );
      }

      if (key === "start_date") {
        const filterStartDate = new Date(filters["start_date"][0]);

        if (isNaN(filterStartDate.getTime())) {
          return true; // Handle invalid date
        }

        const itemStartDate = new Date(item.sampleStartDate);
        let itemEndDate = new Date(item.sampleEndDate);

        // Check if the end date is before the start date (Fix for particular yellow fever studies in central africa that have start date 2009 and end date for 1969)
        if (itemEndDate < itemStartDate) {
          // Set the end date to be the same or 1 month after the start date
          itemEndDate = new Date(itemStartDate);
          itemEndDate.setMonth(itemEndDate.getMonth() + 1);
        }

        // Check for any overlap in the sampling period
        return itemEndDate >= filterStartDate;
      }
      if (key === "antibody") {
        return item["antibodies"].some((element: string) =>
          filters[key].includes(element)
        );
      } else {
        if (Array.isArray(item[key])) {
          // If item[key] is an array, check if any element of item[key] is included in filters[key]
          return item[key].some((element: string) =>
            filters[key].includes(element)
          );
        } else {
          // If item[key] is a string, check if it's included in filters[key]
          return filters[key].includes(item[key]);
        }
      }
    });
  });
}

export const applyNewSelectedFilters = (
  input: HandleArboFilterUpdateInput
): HandleArboFilterUpdateOutput => ({
  ...input,
  state: {
    ...input.state,
    filteredData: filterData(
      input.action.payload.data,
      input.state.selectedFilters
    ),
    dataFiltered: true,
  },
});
