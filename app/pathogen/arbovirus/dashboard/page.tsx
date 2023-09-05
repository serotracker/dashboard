'use client'

import React, {useContext, useEffect, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";

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
} from "@/components/ui/select"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {MultiSelect, MultiSelectOption} from "@/components/customs/multi-select";

export default function ArbovirusDashboard() {

    const query = useQuery({
        queryKey: ['ArbovirusRecords'],
        queryFn: () => fetch("http://localhost:5000/data_provider/records/arbo").then(
            (response) => response.json()
        ),
    })

    const {map, mapContainer} = useMap(query);
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({})

    // For now cannot select multiple filters

    const addFilterMulti = (value: string[], newFilter: string) => {
        console.log("Adding filter: ", value, newFilter)
        setSelectedFilters(prevState => {
            let mapboxFilters: any = []

            Object.keys(prevState).forEach((filter: string) => {
                const keyFilters: any = []
                if (filter !== newFilter && prevState[filter].length > 0) {
                    prevState[filter].forEach((filterValue: string) => {
                        keyFilters.push(['in', filterValue, ['get', filter]])
                    })
                }
                if(keyFilters.length > 0) mapboxFilters.push(['any', ...keyFilters])
            })

            if (value.length > 0) {
                const keyFilters: any = []
                value.forEach((filterValue: string) => {
                    keyFilters.push(['in', filterValue, ['get', newFilter]])
                })
                if(keyFilters.length > 0) mapboxFilters.push(['any', ...keyFilters])

            };

            console.log("Filters: ", ['all', ...mapboxFilters]);
            map.current?.setFilter('arbo-pins', ['all', ...mapboxFilters])

            return ({
                ...prevState, [newFilter]: value
            })
        });
    }

    const buildFilterDropdown = (filter: string, placeholder: string) => {
        return (
            <div className="pb-3">
                <MultiSelect
                    handleOnChange={(value) => addFilterMulti(value, filter)}
                    heading={placeholder}
                    selected={selectedFilters[filter]}
                    options={filters.data[filter].filter((assay: string) => assay != null)}
                />
            </div>
        )
    }

    const filters = useQuery({
        queryKey: ['ArbovirusFilters'],
        queryFn: () => fetch("http://localhost:5000/data_provider/arbo/filter_options").then(
            (response) => response.json()
        ),
    })

    if(filters.isSuccess && !filters.isLoading && !filters.isError) {
        console.log(filters.data, Object.keys(filters.data))

        Object.keys(filters.data).forEach((key: string) => {
            if(!selectedFilters[key]) {
                setSelectedFilters(prevState => ({
                    ...prevState, [key]: []
                }))
            }
        })
    }

    if (!query.isLoading && !query.isError) {
        console.log(query.data)
    } else {
        console.log("loading or errored", query.error, query.isError, query.isLoading)
    }





    return (
        <div className={"grid gap-4 grid-cols-16 w-full h-full"}>
            <div className={"col-span-4 flex flex-col"}>
                <Card className={""}>
                    <CardHeader>
                        <CardTitle>Visualizations</CardTitle>
                        <CardContent>

                        </CardContent>
                    </CardHeader>
                </Card>
                <Card className={""}>
                    <CardHeader>
                        <CardTitle>Visualizations</CardTitle>
                        <CardContent>

                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
            <Card className={"w-full h-full overflow-hidden col-span-9"}>
                <CardContent ref={mapContainer} className={"w-full h-full"}/>
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
                            <div>
                                {buildFilterDropdown('age_group', "Age Group")}
                            </div>
                            <div>
                                {buildFilterDropdown('sex', "Sex")}
                            </div>
                            <div>
                                {buildFilterDropdown('country', "Country")}
                            </div>
                        </div>
                        <div className="p-0">
                            {/*<div>*/}
                            {/*    <SectionHeader header_text={"Study Information"} tooltip_text={"Filter on different types of study based metadata"}/>*/}
                            {/*</div>*/}
                            <div>
                                {/*{buildFilterDropdown('assay', "Assay")}*/}
                                {buildFilterDropdown('assay', "Assay")}
                            </div>
                            <div>
                                {buildFilterDropdown('producer', "Producer")}
                            </div>
                            <div>
                                {buildFilterDropdown('sample_frame', "Sample Frame")}
                            </div>
                            <div>
                                {buildFilterDropdown('antibody', "Antibody")}
                            </div>
                            <div>
                                {/*<MultiSelect*/}
                                {/*    handleOnChange={(value) => addFilterMulti(value, 'antibody')}*/}
                                {/*    heading={"Antibody"}*/}
                                {/*    selected={selectedFilters['antibody'] ?? []}*/}
                                {/*    options={filters.data['antibody']}*/}
                                {/*/>*/}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}