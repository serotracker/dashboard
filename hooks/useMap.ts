import React, {useEffect, useRef} from 'react';
import mapboxgl from "mapbox-gl";
import {getEsriVectorSourceStyle} from "@/app/pathogen/arbovirus/dashboard/MappingUtil";
import {MapResources} from "@/app/pathogen/arbovirus/dashboard/MapConfig";
import ReactDOMServer from "react-dom/server";
import ArboStudyPopup from "@/app/pathogen/arbovirus/dashboard/ArboStudyPopup";
import {UseQueryResult} from "@tanstack/react-query";
import 'mapbox-gl/dist/mapbox-gl.css';

console.log(process.env.NEXT_PUBLIC_MAPBOX_API_KEY)
mapboxgl.accessToken =  process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

export default function useMap(query: UseQueryResult<any, unknown>) {
    const map = useRef<mapboxgl.Map | null>(null);
    const mapContainer = useRef(null);
    // Creates map, only runs once
    useEffect(() => {
        if (map.current || !mapContainer.current) return; // initialize map only once

        (async () => {
            if (!mapContainer.current) return; // initialize map only once

            const baseMapStyle = await getEsriVectorSourceStyle(MapResources.WHO_BASEMAP);

            //base map style has 31 layers
            //Countries layer is added on top later.
            map.current = new mapboxgl.Map({
                container: mapContainer.current, // container id
                style: baseMapStyle,
                center: [10, 30] as [number, number],
                zoom: 2,
                minZoom: 2,
                maxZoom: 14,
                attributionControl: false,
                scrollZoom: false
            }).addControl(new mapboxgl.NavigationControl());
        })();

        return () => map.current?.remove()

    }, []);

    useEffect(() => {
        if(map.current && query.data) {
            // Add arbo pins
            // Once data loads then populate map
            if(query.data) {
                // Create array of pin features
                const arboStudyPins = query.data.records.map((record: any) => {
                    return {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [record.latitude, record.longitude]
                        },
                        properties: {
                            title: record.title,
                            pathogen: record.pathogen,
                            id: record.id,
                            age_group: record.age_group,
                            sex: record.sex,
                            country: record.country,
                            assay: record.assay,
                            producer: record.producer,
                            sample_frame: record.sample_frame
                        }
                    }
                })

                if(map.current.getLayer('arbo-pins') == undefined) {
                    // Create mapbox source
                    map.current.addSource('arboStudyPins', {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: arboStudyPins
                        }
                    })

                    // Create mapbox circle layer for pins
                    map.current.addLayer({
                        id: "arbo-pins",
                        type: "circle",
                        source: "arboStudyPins",
                        paint: {
                            "circle-color": [
                                "match",
                                ["get", "pathogen"],
                                "ZIKV",
                                "#A0C4FF",
                                "CHIKV",
                                "#9BF6FF",
                                "WNV",
                                "#CAFFBF",
                                "DENV",
                                "#FDFFB6",
                                "YF",
                                "#FFD6A5",
                                "MAYV",
                                "#FFADAD",
                                "#FFFFFC",
                            ],
                            "circle-radius": 8,
                            "circle-stroke-color": "#333333",
                            "circle-stroke-width": 1,
                        },
                    })

                    let pinPopup: mapboxgl.Popup | undefined = undefined;
                    console.log("adding event listeners")
                    map.current.on("mouseenter", "arbo-pins", function () {
                        if(map.current) map.current.getCanvas().style.cursor = "pointer";
                    });
                    map.current?.on("mouseleave", "arbo-pins", function () {
                        if(map.current) map.current.getCanvas().style.cursor = "";
                    });

                    map.current.on("click", "arbo-pins", function (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
                        if (pinPopup !== undefined) {
                            pinPopup.remove()
                        }

                        let study = query.data.records.filter((record: any) => record.id === e.features[0].properties.id);

                        if(study !== undefined && study.length > 0) {
                            if(map.current)
                                pinPopup = new mapboxgl.Popup({ offset: 5, className: "pin-popup" })
                                    .setLngLat(e.lngLat)
                                    .setMaxWidth("480px")
                                    .setHTML(ReactDOMServer.renderToString(ArboStudyPopup(study[0])))
                                    .addTo(map.current);
                        }

                    })
                }
            }
        }
    }, [query.data, map])

    return {map, mapContainer};
}