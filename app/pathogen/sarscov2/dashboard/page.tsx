"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// TODO: replace shadcn SELECT with shadcn esque multiselect -- or build a multiselect using shadcn
import useMap from "@/hooks/useMap";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArbovirusDashboard() {
  const query = useQuery({
    queryKey: ["SC2virusRecords"],
    queryFn: () =>
      fetch("http://127.0.0.1:5000/data_provider/records").then((response) =>
        response.json(),
      ),
  });

  const { map, mapContainer } = useMap(query);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});

  // For now cannot select multiple filters
  const addFilter = (value: string, newFilter: string) => {
    setSelectedFilters((prevState) => {
      let mapboxFilters = [];

      Object.keys(prevState).forEach((filter: string) => {
        if (filter !== newFilter && prevState[filter].length > 0)
          mapboxFilters.push(["in", filter, ...prevState[filter]]);
      });

      if (value.length > 0) mapboxFilters.push(["in", newFilter, value]);

      console.log("Filters: ", mapboxFilters);
      map.current?.setFilter("arbo-pins", ["all", ...mapboxFilters]);

      return {
        ...prevState,
        [newFilter]: [value],
      };
    });
  };

  const buildFilterDropdown = (filter: string, placeholder: string) => {
    return (
      <div className="pb-3">
        <Select
          onValueChange={(value) => {
            addFilter(value, filter);
          }}
          // defaultValue={selectedFilters[filter][0] as string}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{filter}</SelectLabel>
              {filters.data[filter].map((filterOption: string) => (
                <SelectItem key={filterOption} value={filterOption}>
                  {filterOption}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const filters = useQuery({
    queryKey: ["ArbovirusFilters"],
    queryFn: () =>
      fetch("http://127.0.0.1:5000/data_provider/arbo/filter_options").then(
        (response) => response.json(),
      ),
  });

  if (!filters.isLoading && !filters.isError) {
    console.log(filters.data);
  } else {
    console.log(
      "loading or errored filters",
      filters.error,
      filters.isError,
      filters.isLoading,
    );
  }

  if (!query.isLoading && !query.isError) {
    console.log(query.data);
  } else {
    console.log(
      "loading or errored",
      query.error,
      query.isError,
      query.isLoading,
    );
  }

  return (
    <div className={"grid gap-4 grid-cols-16 w-full h-full"}>
      <div className={"col-span-4 flex flex-col"}>
        <Card className={""}>
          <CardHeader>
            <CardTitle>Visualizations</CardTitle>
            <CardContent></CardContent>
          </CardHeader>
        </Card>
        <Card className={""}>
          <CardHeader>
            <CardTitle>Visualizations</CardTitle>
            <CardContent></CardContent>
          </CardHeader>
        </Card>
      </div>
      <Card className={"w-full h-full overflow-hidden col-span-9"}>
        <CardContent ref={mapContainer} className={"w-full h-full"} />
      </Card>
      {!filters.isLoading && !filters.isError && (
        <Card className={"col-span-3"}>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
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
              <div>{buildFilterDropdown("assay", "Assay")}</div>
              <div>{buildFilterDropdown("producer", "Producer")}</div>
              <div>{buildFilterDropdown("sample_frame", "Sample Frame")}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
