"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import { MapResources } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";
import ReactDOMServer from "react-dom/server";
import ArboStudyPopup from "@/app/pathogen/arbovirus/dashboard/ArboStudyPopup";
import { Expressions } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";
import SarsCov2StudyPopup from "@/app/pathogen/sarscov2/dashboard/(map)/SarsCov2StudyPopup";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

function addArboDataLayers(map: mapboxgl.Map, data: any) {
  
  // Create mapbox source
  if(!map.getSource("arboStudyPins")){
    const arboStudyPins = data.map((record: any) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [record.latitude, record.longitude],
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
          sample_frame: record.sample_frame,
          antibody: record.antibodies,
        },
      };
    });

    console.log("adding arbo source")
    map.addSource("arboStudyPins", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: arboStudyPins,
      },
    });
  }

  // Create mapbox circle layer for pins
  if(map.getLayer("Arbovirus-pins")) map.removeLayer("Arbovirus-pins");
  map.addLayer({
    id: "Arbovirus-pins",
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
    },
  });
}

function addSarsCov2DataLayers(map: mapboxgl.Map, data: any) {
  
  // Create mapbox source
  if(!map.getSource("sarscov2StudyPins")) {
    const sarscov2StudyPins = data.map((record: any, index: number) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [record.pin_longitude, record.pin_latitude],
        },
        properties: {
          title: record.study_name,
          id: record.study_name,
          age: record.age,
          sex: record.sex,
          estimate_grade: record.estimate_grade,
          overall_risk_of_bias: record.overall_risk_of_bias,
          population_group: record.population_group,
          source_type: record.source_type,
          test_type: record.test_type,
        },
      };
    });

    map.addSource("sarscov2StudyPins", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: sarscov2StudyPins,
      },
    });
  }

  // Create mapbox circle layer for pins
  if(map.getLayer("SarsCov2-pins")) map.removeLayer("SarsCov2-pins");
  map.addLayer({
    id: "SarsCov2-pins",
    type: "circle",
    source: "sarscov2StudyPins",
    paint: Expressions.Studies as mapboxgl.CirclePaint,
  });
}

export const getMapboxLatitudeOffset = (map: mapboxgl.Map | undefined) => {
  // Map seems to zoom in in powers of 2, so reducing offset by powers of 2 keeps the modal apprximately
  // in the same center everytime
  if(map){
    // offset needs to reduce exponentially with zoom -- higher zoom x smaller offset
    let mapZoom = map.getZoom();

    return 80/(Math.pow(2, mapZoom))
  }
  return 0
}

function initializeMap(map: mapboxgl.Map, data: any, pathogen: "Arbovirus" | "SarsCov2") {
  let pinPopup: mapboxgl.Popup | undefined = undefined;
  console.debug("adding event listeners");
  map.on("mouseenter", `${pathogen}-pins`, function () {
    if (map) map.getCanvas().style.cursor = "pointer";
  });
  map?.on("mouseleave", `${pathogen}-pins`, function () {
    if (map) map.getCanvas().style.cursor = "";
  });

  map.on(
    "click",
    `${pathogen}-pins`,
    function (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
      if (pinPopup !== undefined) {
        pinPopup.remove();
      }

      let study = data.filter(
        (record: any) => pathogen == "Arbovirus" ? record.id === e.features[0].properties.id: record.study_name === e.features[0].properties.id,
      );


      if (study !== undefined && study.length > 0) {
        if (map){
          pinPopup = new mapboxgl.Popup({
            offset: 5,
            className: "pin-popup",
          })
            .setLngLat(e.lngLat)
            .setMaxWidth("480px")
            .setHTML(ReactDOMServer.renderToString(pathogen == "Arbovirus" ? ArboStudyPopup(study[0]) : SarsCov2StudyPopup(study[0])))
            .addTo(map);
          
            map.flyTo({
              center: [e.lngLat.lng, e.lngLat.lat - getMapboxLatitudeOffset(map)],
              curve: 0.5,
              speed: 0.5,
              });
          }
      }
    },
  );
}

export default function useMap(
  data: any,
  pathogen: "Arbovirus" | "SarsCov2",
): {
  map: mapboxgl.Map | undefined;
  mapContainer: React.MutableRefObject<null>;
} {
  // TODO: Come back and see if things can be done better if needed.
  // TODO: Add customization to make this a pure reusable hook

  const [pageIsMounted, setPageIsMounted] = React.useState(false);
  const [map, setMap] = useState<mapboxgl.Map>();
  const mapContainer = useRef(null);
  // Creates map, only runs once
  useEffect(() => {
    setPageIsMounted(true);

    if (map || !mapContainer.current) return; // initialize map only once

    (async () => {
      if (!mapContainer.current) return; // initialize map only once

      const baseMapStyle = await getEsriVectorSourceStyle(
        MapResources.WHO_BASEMAP,
      );

      //base map style has 31 layers
      //Countries layer is added on top later.
      const newMap = new mapboxgl.Map({
        container: mapContainer.current, // container id
        style: baseMapStyle,
        center: [10, 30] as [number, number],
        zoom: 2,
        minZoom: 2,
        maxZoom: 14,
        attributionControl: false,
        scrollZoom: false,
      }).addControl(new mapboxgl.NavigationControl());

      initializeMap(newMap, data, pathogen);
      setMap(newMap);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (map && pageIsMounted && data) {
      map.on("load", () => {
        switch (pathogen) {
          case "Arbovirus":
            console.log("adding arbovirus layers")
            addArboDataLayers(map as mapboxgl.Map, data);
            break;
          case "SarsCov2":
            console.log("adding sarscov2 layers")
            addSarsCov2DataLayers(map as mapboxgl.Map, data);
            break;
        }

      });
    }
  }, [data, map, pageIsMounted]);

  return { map, mapContainer };
}
