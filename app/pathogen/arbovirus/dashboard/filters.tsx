"use client";

import {
  ArboActionType,
  ArboContext,
  ArboContextType,
} from "@/contexts/arbo-context";
import { MultiSelect } from "@/components/customs/multi-select";
import React, { useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import mapboxgl from "mapbox-gl";
import useArboData from "@/hooks/useArboData";

const addFilterMulti = (
  value: string[],
  newFilter: string,
  state: ArboContextType,
  data: any,
) => {
  state.dispatch({
    type: ArboActionType.UPDATE_FILTER,
    payload: {
      filter: newFilter,
      value: value,
      data: data ? data : [],
    },
  });
};

const buildFilterDropdown = (
  filter: string,
  placeholder: string,
  state: ArboContextType,
  filterOptions: string[],
  data: any,
) => {


  return (
      <div className="pb-3">
        <MultiSelect
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
  const state = useContext(ArboContext);

  const { data } = useArboData();

  const filters = useQuery({
    queryKey: ["ArbovirusFilters"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/arbo/filter_options`).then(
        (response) => response.json(),
      ),
  });

  if (filters.isSuccess && !filters.isLoading && !filters.isError) {
    console.debug(filters.data, Object.keys(filters.data));

    return (
      <div>
        <div className="p-0">
          {/*<div>*/}
          {/*    <SectionHeader*/}
          {/*        header_text={"Demographics"}*/}
          {/*        tooltip_text={"Participant related data"}*/}
          {/*    />*/}
          {/*</div>*/}
          <div>
            {buildFilterDropdown(
              "age_group",
              "Age Group",
              state,
              filters.data["age_group"],
              data ? data.records : [],
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "sex",
              "Sex",
              state,
              filters.data["sex"],
              data ? data.records : [],
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "country",
              "Country",
              state,
              filters.data["country"],
              data ? data.records : [],
            )}
          </div>
        </div>
        <div className="p-0">
          {/*<div>*/}
          {/*    <SectionHeader header_text={"Study Information"} tooltip_text={"Filter on different types of study based metadata"}/>*/}
          {/*</div>*/}
          <div>
            {buildFilterDropdown(
              "assay",
              "Assay",
              state,
              filters.data["assay"],
              data ? data.records : [],
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "producer",
              "Producer",
              state,
              filters.data["producer"],
              data ? data.records : [],
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "sample_frame",
              "Sample Frame",
              state,
              filters.data["sample_frame"],
              data ? data.records : [],
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "antibody",
              "Antibody",
              state,
              filters.data["antibody"],
              data ? data.records : [],
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "pathogen",
              "Pathogen",
              state,
              filters.data["pathogen"],
              data ? data.records : [],
            )}
          </div>
        </div>
      </div>
    );
  } else return <div>Filters Loading...</div>;
}
