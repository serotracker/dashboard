import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { getEsriVectorSourceStyle } from "@/app/pathogen/arbovirus/dashboard/(map)/mapping-util";
import { MapResources } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";
import ReactDOMServer from "react-dom/server";
import ArboStudyPopup from "@/app/pathogen/arbovirus/dashboard/ArboStudyPopup";
import { useQuery } from "@tanstack/react-query";
import "mapbox-gl/dist/mapbox-gl.css";
import { ArboContextType, setMapboxFilters } from "@/contexts/arbo-context";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

function addDataLayers(map: mapboxgl.Map, data: any) {
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

  // Create mapbox source
  map.addSource("arboStudyPins", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: arboStudyPins,
    },
  });

  // Create mapbox circle layer for pins
  map.addLayer({
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

function initializeMap(map: mapboxgl.Map, data: any) {
  let pinPopup: mapboxgl.Popup | undefined = undefined;
  console.debug("adding event listeners");
  map.on("mouseenter", "arbo-pins", function () {
    if (map) map.getCanvas().style.cursor = "pointer";
  });
  map?.on("mouseleave", "arbo-pins", function () {
    if (map) map.getCanvas().style.cursor = "";
  });

  map.on(
    "click",
    "arbo-pins",
    function (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
      if (pinPopup !== undefined) {
        pinPopup.remove();
      }

      let study = data.filter(
        (record: any) => record.id === e.features[0].properties.id,
      );

      if (study !== undefined && study.length > 0) {
        if (map)
          pinPopup = new mapboxgl.Popup({
            offset: 5,
            className: "pin-popup",
          })
            .setLngLat(e.lngLat)
            .setMaxWidth("480px")
            .setHTML(ReactDOMServer.renderToString(ArboStudyPopup(study[0])))
            .addTo(map);
      }
    },
  );
}

export default function useMap(
  data: any,
  state: ArboContextType,
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

      initializeMap(newMap, data);
      setMap(newMap);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (map && pageIsMounted && data) {
      map.on("load", () => {
        addDataLayers(map as mapboxgl.Map, data);
        if (state.selectedFilters)
          setMapboxFilters(state.selectedFilters, map as mapboxgl.Map);
      });
    }
  }, [data, map, pageIsMounted, state?.selectedFilters]);

  return { map, mapContainer };
}
