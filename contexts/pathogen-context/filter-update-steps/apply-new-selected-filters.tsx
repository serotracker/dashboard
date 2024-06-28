import {
  HandleFilterUpdateInput,
  HandleFilterUpdateOutput,
} from "../../pathogen-context/filter-update-steps";
import { PathogenContextState } from "../pathogen-context";

interface DefaultDataFilterHandlerInput {
  item: Record<string, string[] | string>;
  key: string;
  filters: Record<string, string[]>;
}

const defaultDataFilterHandler = (input: DefaultDataFilterHandlerInput): boolean => {
  const { item, key, filters } = input;

  const value = input.item[input.key]

  if (Array.isArray(value)) {
    // If item[key] is an array, check if any element of item[key] is included in filters[key]
    return value.some((element: string) =>
      filters[key].includes(element)
    );
  } else {
    // If item[key] is a string, check if it's included in filters[key]
    return filters[key].includes(value);
  }
}

export function filterData(
  data: any[],
  filters: { [key: string]: string[] }
): any[] {
  const filterKeys = Object.keys(filters);

  // So over here we have data and filters. we extract the filter keys. thenw e filter the data
  // while filtering the data we take each item and check if it is passes the test for each and every one of the filters. 
  return data.filter((item: any) => {
    return filterKeys.every((key: string) => {
      /* If no pathogen is selected, we don't want to see any data */
      if (key === "pathogen" && filters[key].length == 0 ){
        return false;
      }

      /* If no scope is selected, we don't want to see any data */
      if (key === "scope" && filters[key].length == 0 ){
        return false;
      }

      /* Ignore pediatric age group for non pediatric age groups. */
      if (key === "pediatricAgeGroup" && item["ageGroup"] !== "Children and Youth (0-17 years)"){
        return true;
      }
      if (!filters[key].length) return true;

      switch (key) {
        case "start_date": {
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
        case "samplingStartDate": {
          const filterStartDate = new Date(filters["samplingStartDate"][0]);

          if (isNaN(filterStartDate.getTime())) {
            return true; // Handle invalid date
          }

          const itemStartDate = new Date(item.samplingStartDate);
          let itemEndDate = new Date(item.samplingEndDate);

          // Check if the end date is before the start date (Fix for particular yellow fever studies in central africa that have start date 2009 and end date for 1969)
          if (itemEndDate < itemStartDate) {
            // Set the end date to be the same or 1 month after the start date
            itemEndDate = new Date(itemStartDate);
            itemEndDate.setMonth(itemEndDate.getMonth() + 1);
          }

          // Check for any overlap in the sampling period
          return itemEndDate >= filterStartDate;
        }
        case "end_date": {
          const filterEndDate = new Date(filters["end_date"][0]);

          if (isNaN(filterEndDate.getTime())) {
            return true; // Handle invalid date
          }

          const itemStartDate = new Date(item.sampleStartDate);
          const itemEndDate = new Date(item.sampleEndDate);

          // Check for any overlap in the sampling period
          return (
            itemEndDate <= filterEndDate ||
            (itemEndDate >= filterEndDate && itemStartDate < filterEndDate));
        } 
        case "samplingEndDate": {
          const filterEndDate = new Date(filters["samplingEndDate"][0]);

          if (isNaN(filterEndDate.getTime())) {
            return true; // Handle invalid date
          }

          const itemStartDate = new Date(item.samplingStartDate);
          const itemEndDate = new Date(item.samplingEndDate);

          // Check for any overlap in the sampling period
          return (
            itemEndDate <= filterEndDate ||
            (itemEndDate >= filterEndDate && itemStartDate < filterEndDate));
        } 
        case "antibody": {
          return item["antibodies"].some((element: string) =>
            filters[key].includes(element)
          );
        }
        case "countryAlphaTwoCode":  
        case "unRegion": 
        case "whoRegion": {
          return filters["countryAlphaTwoCode"]?.includes(item["countryAlphaTwoCode"]) || filters["unRegion"]?.includes(item["unRegion"]) || filters["whoRegion"]?.includes(item["whoRegion"]);
        }
        case "diagnosisSource": {
          if(item['__typename'] === 'AnimalMersEvent' || item['__typename'] === 'HumanMersEvent') {
            return defaultDataFilterHandler({
              item,
              key,
              filters
            });
          }

          return true;
        }
        case "animalSpecies":
        case "animalType": {
          if(item['__typename'] === 'AnimalMersEvent') {
            return defaultDataFilterHandler({
              item,
              key,
              filters
            });
          }

          return true;
        }
        case "esm": {
          switch(filters["esm"][0]){
            case "zika": 
              return item["pathogen"] === "ZIKV";
            case "dengue2015":
            case "dengue2050":
              return item["pathogen"] === "DENV";
            default:
              return true;
          }
        }
        default: {
          return defaultDataFilterHandler({
            item,
            key,
            filters
          });
        }
      }
    });
  });
}

export const applyNewSelectedFilters = <
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
>(
  input: HandleFilterUpdateInput<TData, TPathogenContextState>
): HandleFilterUpdateOutput<TData, TPathogenContextState> => ({
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
