"use client";

import { Map, Source, Layer, Popup, useMap, MapRef, NavigationControl } from 'react-map-gl';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Filters from "@/app/pathogen/arbovirus/dashboard/filters";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import useArboData from "@/hooks/useArboData";
import { ArboActionType, ArboContext } from "@/contexts/arbo-context";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";
import { getEsriVectorSourceStyle } from '@/utils/mapping-util';
import { MapResources } from './map-config';
import mapboxgl from 'mapbox-gl';
import ArboStudyPopup from '../ArboStudyPopup';

export const pathogenColorsTailwind: { [key: string]: string } = {
  ZIKV: "border-[#A0C4FF] data-[state=checked]:bg-[#A0C4FF]",
  CHIKV: "border-[#9BF6FF] data-[state=checked]:bg-[#9BF6FF]",
  WNV: "border-[#CAFFBF] data-[state=checked]:bg-[#CAFFBF]",
  DENV: "border-[#FFADAD] data-[state=checked]:bg-[#FFADAD]",
  YF: "border-[#FFD6A5] data-[state=checked]:bg-[#FFD6A5]",
  MAYV: "border-[#FDFFB6] data-[state=checked]:bg-[#FDFFB6]",
};

export const pathogenColors: { [key: string]: string } = {
  ZIKV: "#A0C4FF",
  CHIKV: "#9BF6FF",
  WNV: "#CAFFBF",
  DENV: "#FFADAD",
  YF: "#FFD6A5",
  MAYV: "#FDFFB6",
};

export default function MapAndFilters() {
  const dataQuery = useArboData();
  const { arboMap } = useMap();
  const state = useContext(ArboContext);
  const [cursor, setCursor] = useState<string>('')
  const [popUpInfo, setPopUpInfo] = useState<any>({visible: false, data: null});
  const mapboxApiKey = useMemo(() => {
    return process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;
  }, [])

  const onMouseEnter = ((event:mapboxgl.MapLayerMouseEvent) => {
    if(!event.features || event.features.length == 0) {
      return;
    }

    if(event.features.every((feature) => feature.layer.id == 'Arbovirus-pins')) {
      setCursor('pointer')

      return
    }

    setCursor('')
  })

  const getMapboxLatitudeOffset = (map: MapRef) => {
    // Map seems to zoom in in powers of 2, so reducing offset by powers of 2 keeps the modal apprximately
    // in the same center everytime
    // offset needs to reduce exponentially with zoom -- higher zoom x smaller offset
    let mapZoom = map.getZoom();

    return 80/(Math.pow(2, mapZoom))
  }

  const onMouseDown = ((event:mapboxgl.MapLayerMouseEvent) => {
    console.log('onMouseDown', event.features);

    if(!event.features || event.features.length == 0) {
      setPopUpInfo({visible: false, data: null})

      return;
    }

    if(event.features.every((feature) => feature.layer.id == 'Arbovirus-pins')) {
      if(arboMap) {
        arboMap.flyTo(
          {center: [event.lngLat.lng, event.lngLat.lat - getMapboxLatitudeOffset(arboMap)]}
        );
      }

      setPopUpInfo({
        visible: true,
        data: {
          latitude: event.features[0].properties?.latitude,
          longitude: event.features[0].properties?.longitude,
          city: event.features[0].properties?.city,
          state: event.features[0].properties?.state,
          country: event.features[0].properties?.country,
          pathogen: event.features[0].properties?.pathogen,
          url: event.features[0].properties?.url,
          seroprevalence: event.features[0].properties?.seroprevalence,
          sample_start_date: event.features[0].properties?.sample_start_date,
          sample_end_date: event.features[0].properties?.sample_end_date,
          inclusion_criteria: event.features[0].properties?.inclusion_criteria,
          sample_size: event.features[0].properties?.sample_size,
          antibodies: event.features[0].properties?.antibodies.slice(1, -1).split(",").map((innerString: string) => innerString.slice(1, -1)),
          antigen: event.features[0].properties?.antigen,
          assay: event.features[0].properties?.assay,
        }
      })
    }
  })

  const onMouseLeave = ((event:mapboxgl.MapLayerMouseEvent) => {
    if(!event.features || event.features.length == 0) {
      return;
    }

    if(event.features.every((feature) => feature.layer.id == 'Arbovirus-pins')) {
      setCursor('')

      return
    }

    setCursor('')
  })

  const geojsonData = useMemo(() => {
    const arboStudyPins = state.filteredData.map((record: any) => {
      return {
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [record.latitude, record.longitude],
        },
        properties: {
          title: record.title,
          latitude: record.latitude,
          longitude: record.longitude,
          city: record.city,
          state: record.state,
          country: record.country,
          pathogen: record.pathogen,
          url: record.url,
          seroprevalence: record.seroprevalence,
          sample_start_date: record.sample_start_date,
          sample_end_date: record.sample_end_date,
          inclusion_criteria: record.inclusion_criteria,
          sample_size: record.sample_size,
          antibodies: record.antibodies,
          antigen: record.antigen,
          assay: record.assay,
        },
      };
    });

    return {
      type: "FeatureCollection" as const,
      features: arboStudyPins
    }

  }, [state.filteredData])

  const filters = useQuery({
    queryKey: ["ArbovirusFilters"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/arbo/filter_options`).then(
        (response) => response.json(),
      ),
  });

  const [mapStyle, setMapStyle] = useState(null);

  if (dataQuery.isSuccess && dataQuery.data) {
    const handleOnClickCheckbox = (pathogen: string, checked: boolean) => {
      const value = state.selectedFilters.pathogen;

      if (checked) {
        value.push(pathogen);
      } else {
        value.splice(value.indexOf(pathogen), 1);
      }

      state.dispatch({
        type: ArboActionType.UPDATE_FILTER,
        payload: {
          data: dataQuery.data.records,
          filter: "pathogen",
          value: value,
        },
      });
    };

    useEffect(() => {
      getEsriVectorSourceStyle(MapResources.WHO_BASEMAP).then((mapStyle) => setMapStyle(mapStyle));
    }, [])

    useEffect(() => {
      console.log('popUpInfo', popUpInfo)
    }, [popUpInfo])

    if(!mapStyle) {
      return;
    }

    return (
      <>
        <Card
          className={
            "w-full h-full overflow-hidden col-span-6 row-span-2 relative"
          }
        >
          <div className={"w-full h-full p-0"}>
            <Map
              id="arboMap"
              cursor={cursor}
              mapStyle={mapStyle}
              initialViewState={{
                latitude: 10,
                longitude: 30,
                zoom: 2,
              }}
              attributionControl={false}
              scrollZoom={false}
              minZoom={2}
              maxZoom={14}
              interactiveLayerIds={['Arbovirus-pins']}
              mapboxAccessToken={mapboxApiKey}
              onMouseEnter={onMouseEnter}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
            >
              <NavigationControl/>
              <Source id="arboStudyPins" type="geojson" data={geojsonData}>
                <Layer
                  id="Arbovirus-pins"
                  type='circle'
                  source="arboStudyPins"
                  paint={{
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
                      "#FFADAD",
                      "YF",
                      "#FFD6A5",
                      "MAYV",
                      "#FDFFB6",
                      "#FFFFFC",
                    ],
                    "circle-radius": 8,
                    "circle-stroke-color": "#333333",
                    "circle-stroke-width": 1,
                  }}
                />
                  { (popUpInfo.visible && popUpInfo.data)  &&  (
                  <Popup 
                    anchor='top'
                    style={{maxWidth:'none'}}
                    closeOnClick={false}
                    latitude={popUpInfo.data.longitude ?? 0}
                    longitude={popUpInfo.data.latitude ?? 0}
                  >
                    <ArboStudyPopup
                      record={popUpInfo.data}
                    />
                  </Popup>
                  )}
              </Source>
            </Map>
          </div>
          <Card className={"absolute bottom-1 right-1 "}>
            <CardHeader className={"py-3"}>
              <p>Pathogens</p>
            </CardHeader>
            <CardContent className={"flex justify-center flex-col"}>
              {filters.isSuccess &&
                filters.data &&
                filters.data.pathogen.map((pathogen: string) => {
                  return (
                    <div
                      key={pathogen}
                      className="items-top flex space-x-2 my-1"
                    >
                      <Checkbox
                        id={`checkbox-${pathogen}`}
                        className={pathogenColorsTailwind[pathogen]}
                        checked={
                          state.selectedFilters["pathogen"]
                            ? state.selectedFilters["pathogen"].includes(
                                pathogen,
                              )
                            : false
                        }
                        onCheckedChange={(checked: boolean) => {
                          handleOnClickCheckbox(pathogen, checked);
                        }}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`checkbox-${pathogen}`}
                          className={
                            "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          }
                        >
                          {pathogen}
                        </label>
                      </div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
          <Card className={"absolute top-1 left-1 p-2"}>
            <CardContent className={"flex w-fit p-0"}>
              <ScrollText />
              <p className={"ml-1 font-medium"}>{state.filteredData.length}</p>
            </CardContent>
          </Card>
        </Card>
        <Card className={"col-span-2 row-span-2"}>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <Filters />
          </CardContent>
        </Card>
      </>
    );
  } else {
    return <span> Loading... </span>;
  }
}
