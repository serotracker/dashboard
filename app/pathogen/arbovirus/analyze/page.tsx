'use client'

import React from 'react'
import {useQuery} from "@tanstack/react-query";
import useMap from "@/app/(hooks)/useMap";

export default function ArboAnalyze () {

    const query = useQuery({
        queryKey: ['ArbovirusRecords'],
        queryFn: () => fetch("http://localhost:5000/data_provider/records/arbo").then(
            (response) => response.json()
        ),
    })

    const {map, mapContainer} = useMap(query);

    return (
        <div ref={mapContainer} className={"h-80"} />
    )
}