"use client";

import { MultiSelect } from "@/components/customs/multi-select";
import React, { useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  SarsCov2ActionType,
  SarsCov2Context,
  SarsCov2ContextType,
} from "@/contexts/sarscov2-context";
import useSarsCov2Data from "@/hooks/useSarsCov2Data";

const addFilterMulti = (
  value: string[],
  newFilter: string,
  state: SarsCov2ContextType,
  data: any
) => {
  state.dispatch({
    type: SarsCov2ActionType.UPDATE_FILTER,
    payload: {
      filter: newFilter,
      value: value,
      // Consider making this a static list synced with the backend so that context is static and we do not need to do this. 
      data: data ? data : [],
    },
  });
};

const getHeader = (filterKey: string) => {
  const filterHeader = filterKey.replaceAll("_", " ");
  return filterHeader.charAt(0).toUpperCase() + filterHeader.slice(1);
};

const buildFilterDropdown = (
  filter: string,
  placeholder: string,
  state: SarsCov2ContextType,
  filterOptions: string[],
  data: any
) => {

  return (
      <div className="pb-3" key={filter}>
        <MultiSelect
        key={filter}
          handleOnChange={(value) =>
            addFilterMulti(value, filter, state, data)
          }
          heading={placeholder}
          selected={state.selectedFilters[filter] ?? []}
          options={filterOptions.filter((assay: string) => assay != null)}
        />
      </div>
  );
};

export default function Filters() {
  const state = useContext(SarsCov2Context);

  const { data } = useSarsCov2Data();

  const filters = useQuery({
    queryKey: ["SarsCov2Filters"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sarscov2/filter_options`).then(
        (response) => response.json()
      ),
  });

  if (filters.isSuccess && !filters.isLoading && !filters.isError) {

    return (
      <div>
        <div className="p-0">
          {filters.isSuccess &&
            filters.data &&
            Object.keys(filters.data).map((key) => {
              if (key === "population_group") {
                const options = filters.data[key].map((option: any) => {
                  return option.english;
                });
                return (
                  <div key={key}>
                    {buildFilterDropdown(
                      key,
                      getHeader(key),
                      state,
                      options,
                      data ? data.records : []
                    )}
                  </div>
                );
              }
              return (
                <div key={key}>
                  {buildFilterDropdown(
                    key,
                    getHeader(key),
                    state,
                    filters.data[key],
                    data ? data.records : []
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  } else return <div>Filters Loading...</div>;
}
