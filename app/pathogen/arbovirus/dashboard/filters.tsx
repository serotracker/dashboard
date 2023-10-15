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
  map: mapboxgl.Map | null | undefined,
  data: any,
) => {
  state.dispatch({
    type: ArboActionType.UPDATE_FILTER,
    payload: {
      filter: newFilter,
      value: value,
      map: map,
      data: data ? data : [],
    },
  });
};

const buildFilterDropdown = (
  filter: string,
  placeholder: string,
  state: ArboContextType,
  filterOptions: string[],
  map: mapboxgl.Map | null | undefined,
  data: any,
) => {


  return (
      <div className="pb-3">
        <MultiSelect
          handleOnChange={(value) =>
            addFilterMulti(value, filter, state, map, data)
          }
          heading={placeholder}
          selected={state.selectedFilters[filter] ?? []}
          options={filterOptions.filter((assay: string) => assay != null)}
        />
      </div>
  );
};

export default function Filters(props: { map?: mapboxgl.Map | null }) {
  const state = useContext(ArboContext);
  const { map } = props;

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
              map,
              data ? data.records : [],
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "sex",
              "Sex",
              state,
              filters.data["sex"],
              map,
              data ? data.records : [],
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "country",
              "Country",
              state,
              filters.data["country"],
              map,
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
              map,
              data ? data.records : [],
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "producer",
              "Producer",
              state,
              filters.data["producer"],
              map,
              data ? data.records : [],
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "sample_frame",
              "Sample Frame",
              state,
              filters.data["sample_frame"],
              map,
              data ? data.records : [],
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "antibody",
              "Antibody",
              state,
              filters.data["antibody"],
              map,
              data ? data.records : [],
            )}
          </div>
          {!map && (
            <div>
              {buildFilterDropdown(
                "pathogen",
                "Pathogen",
                state,
                filters.data["pathogen"],
                map,
                data ? data.records : [],
              )}
            </div>
          )}
        </div>
      </div>
    );
  } else return <div>Filters Loading...</div>;
}
