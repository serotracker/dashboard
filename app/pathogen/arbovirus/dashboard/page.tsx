'use client'

import React, {useContext, useEffect, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";

// TODO: replace shadcn SELECT with shadcn esque multiselect -- or build a multiselect using shadcn
import InformationIcon from "./InformationIcon";
import SectionHeader from "./SectionHeader";
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

export default function ArbovirusDashboard() {

    const query = useQuery({
        queryKey: ['ArbovirusRecords'],
        queryFn: () => fetch("http://localhost:5000/data_provider/records/arbo").then(
            (response) => response.json()
        ),
    })

    const {map, mapContainer} = useMap(query);
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({})

    const addFilter = (value: string[], newFilter: string) => {
        setSelectedFilters(prevState => {
            let mapboxFilters = []

            Object.keys(prevState).forEach((filter: string) => {
                if (filter !== newFilter && prevState[filter].length > 0)
                    mapboxFilters.push(['in', filter, ...prevState[filter]])
            })

            if(value.length > 0) mapboxFilters.push(['in', newFilter, ...value]);

            console.log("Filters: ", mapboxFilters);
            map.current?.setFilter('arbo-pins', ['all', ...mapboxFilters])

            return ({
                ...prevState, [newFilter]: value
            })
        });
    }

    const buildFilterDropdown = (filter: string, placeholder: string) => {
        return (
            <div className="pb-3">
                {/*<Dropdown*/}
                {/*    text={placeholder}*/}
                {/*    fluid*/}
                {/*    multiple*/}
                {/*    search*/}
                {/*    clearable*/}
                {/*    selection*/}
                {/*    options={filters.data[filter].map((filterOption: string) => (*/}
                {/*        {*/}
                {/*            key: filterOption,*/}
                {/*            text: filterOption,*/}
                {/*            value: filterOption*/}
                {/*        })*/}
                {/*    )}*/}
                {/*    onChange={}*/}
                {/*    value={selectedFilters[filter] as string[]}*/}
                {/*    defaultValue={selectedFilters[filter] as string[]}*/}
                {/*/>*/}

                <Select
                    // onValueChange={(value) => {
                    //     addFilter(value, filter)
                    // }}
                    // defaultValue={selectedFilters[filter] as string[]}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>filter</SelectLabel>
                            {filters.data[filter].map((filterOption: string) =>
                                (<SelectItem key={filterOption} value={filterOption}>filterOption</SelectItem>)
                            )}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        )
    }



    const filters = useQuery({
        queryKey: ['ArbovirusFilters'],
        queryFn: () => fetch("http://localhost:5000/data_provider/arbo/filter_options").then(
            (response) => response.json()
        ),
    })

    if(!filters.isLoading && !filters.isError) {
        console.log(filters.data)
    } else {
        console.log("loading or errored filters", filters.error, filters.isError, filters.isLoading)
    }

    if(!query.isLoading && !query.isError) {
        console.log(query.data)
    } else {
        console.log("loading or errored", query.error, query.isError, query.isLoading)
    }




    return (
        <>
            {/*<div className="info flex legend center-item">*/}
            {/*    <div className="flex legend-container" key={Math.random()}>*/}
            {/*        <div className="legend-item" id="National">*/}
            {/*            <i className="circleBase legend-icon" style={{ background: "#A0C4FF" }}></i>*/}
            {/*            <label className='legend-label'>Zika</label>*/}
            {/*            <Checkbox className="legend-checkbox" checked={state.explore.legendLayers.National}/>*/}
            {/*        </div>*/}
            {/*        <div className="legend-item" id="Regional">*/}
            {/*            <i className="circleBase legend-icon" style={{ background: "#9BF6FF" }}></i>*/}
            {/*            <label className='legend-label'>Chikungunya</label>*/}
            {/*            <Checkbox className="legend-checkbox" checked={state.explore.legendLayers.Regional}/>*/}
            {/*        </div>*/}
            {/*        <div className="legend-item mb-1" id="Local">*/}
            {/*            <i className="circleBase legend-icon" style={{ background: "#CAFFBF" }}></i>*/}
            {/*            <label className='legend-label'>West Nile</label>*/}
            {/*            <Checkbox className="legend-checkbox" checked={state.explore.legendLayers.Local}/>*/}
            {/*        </div>*/}
            {/*        <div className="legend-item" id="National">*/}
            {/*            <i className="circleBase legend-icon" style={{ background: "#FDFFB6" }}></i>*/}
            {/*            <label className='legend-label'>Dengue</label>*/}
            {/*            <Checkbox className="legend-checkbox" checked={state.explore.legendLayers.National}/>*/}
            {/*        </div>*/}
            {/*        <div className="legend-item" id="Regional">*/}
            {/*            <i className="circleBase legend-icon" style={{ background: "#FFD6A5" }}></i>*/}
            {/*            <label className='legend-label'>Yellow Fever</label>*/}
            {/*            <Checkbox className="legend-checkbox" checked={state.explore.legendLayers.Regional}/>*/}
            {/*        </div>*/}
            {/*        <div className="legend-item mb-1" id="Local">*/}
            {/*            <i className="circleBase legend-icon" style={{ background: "#FFADAD" }}></i>*/}
            {/*            <label className='legend-label'>Mayaro</label>*/}
            {/*            <Checkbox className="legend-checkbox" checked={state.explore.legendLayers.Local}/>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className={"flex w-full h-full"}>
                {!filters.isLoading && !filters.isError && (
                    <div className="w-2/12 p-0 h-full">
                        <div className="py-3 center flex">
                            <div className="subheading">
                                {"Filrter"}
                            </div>
                            {/*// TODO: This stuff needs to be edited*/}
                            <div className="tooltip-vert-adj">
                                <InformationIcon
                                    offset={[10]}
                                    position="bottom right"
                                    color="#455a64"
                                    tooltipHeader={"Filter"}
                                    popupSize="small"
                                    size="sm"
                                    tooltip={"Filter Information"} />
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-10 col align-items-center p-0">
                                <div className="p-0">
                                    <div>
                                        <SectionHeader
                                            header_text={"Demographics"}
                                            tooltip_text={"Participant related data"}
                                        />
                                    </div>
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
                                    <div>
                                        <SectionHeader header_text={"Study Information"} tooltip_text={"Filter on different types of study based metadata"}/>
                                    </div>
                                    <div>
                                        {buildFilterDropdown('assay',"Assay")}
                                    </div>
                                    <div>
                                        {buildFilterDropdown('producer', "Producer")}
                                    </div>
                                    <div>
                                        {buildFilterDropdown('sample_frame', "Sample Frame")}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<div className="row justify-content-center">*/}
                        {/*    <div className="col-10 col align-items-center p-0">*/}
                        {/*        <div className="pb-3">*/}
                        {/*            <Button  className="clear-filters-btn" size="medium" onClick={clearFilter}> {Translate('ClearAllFilters')}</Button>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                )}
                <div ref={mapContainer} className={"w-10/12 h-full"}>
                </div>
            </div>

        </>
    )
}