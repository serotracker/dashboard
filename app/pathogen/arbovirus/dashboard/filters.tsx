"use client";

import { ArboActionType, ArboContext } from "@/contexts/arbo-context";
import { MultiSelect } from "@/components/customs/multi-select";
import React, { useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import mapboxgl from "mapbox-gl";
import useArboData from "@/hooks/useArboData";

export default function Filters(props: { map: mapboxgl.Map | null }) {
  const state = useContext(ArboContext);
  const { map } = props;
  const queryClient = useQueryClient();

  const { data } = useArboData();

  const filters = useQuery({
    queryKey: ["ArbovirusFilters"],
    queryFn: () =>
      fetch("http://localhost:5000/data_provider/arbo/filter_options").then(
        (response) => response.json(),
      ),
  });

  const getData = queryClient.getQueryData(["ArbovirusRecords"]);

  console.log("All Data on filter side using getQueryData: ", getData);

  if (state) {
    const addFilterMulti = (value: string[], newFilter: string) => {
      console.log("Adding filter: ", value, newFilter);
      state?.dispatch({
        type: ArboActionType.UPDATE_FILTER,
        payload: {
          filter: newFilter,
          value: value,
          map: map,
          data: data ? data.records : [],
        },
      });
    };

    const buildFilterDropdown = (filter: string, placeholder: string) => {
      if (!state.selectedFilters[filter]) {
        addFilterMulti([], filter);
      }

      return (
        <div className="pb-3">
          <MultiSelect
            handleOnChange={(value) => addFilterMulti(value, filter)}
            heading={placeholder}
            selected={state.selectedFilters[filter]}
            options={filters.data[filter].filter(
              (assay: string) => assay != null,
            )}
          />
        </div>
      );
    };

    if (filters.isSuccess && !filters.isLoading && !filters.isError) {
      console.log(filters.data, Object.keys(filters.data));

      return (
        <div>
          <div className="p-0">
            {/*<div>*/}
            {/*    <SectionHeader*/}
            {/*        header_text={"Demographics"}*/}
            {/*        tooltip_text={"Participant related data"}*/}
            {/*    />*/}
            {/*</div>*/}
            <div>{buildFilterDropdown("age_group", "Age Group")}</div>
            <div>{buildFilterDropdown("sex", "Sex")}</div>
            <div>{buildFilterDropdown("country", "Country")}</div>
          </div>
          <div className="p-0">
            {/*<div>*/}
            {/*    <SectionHeader header_text={"Study Information"} tooltip_text={"Filter on different types of study based metadata"}/>*/}
            {/*</div>*/}
            <div>
              {/*{buildFilterDropdown('assay', "Assay")}*/}
              {buildFilterDropdown("assay", "Assay")}
            </div>
            <div>{buildFilterDropdown("producer", "Producer")}</div>
            <div>{buildFilterDropdown("sample_frame", "Sample Frame")}</div>
            <div>{buildFilterDropdown("antibody", "Antibody")}</div>
          </div>
        </div>
      );
    } else return <div>Filters Loading...</div>;
  } else {
    return <div>Filters Loading...</div>;
  }
}
