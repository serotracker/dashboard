import { pathogenColors } from "@/app/pathogen/arbovirus/dashboard/(map)/ArbovirusMap";
import { MarkerCollection } from "@/components/ui/pathogen-map/pathogen-map";
import mapboxgl from "mapbox-gl";
import React from "react";
import { Marker, MarkerEvent, useMap } from "react-map-gl";

// This whole file will be custom for each of the pathogens themselves

// code for creating an SVG donut chart from feature properties
export function createDonutChartAndHoverPopup(props: {
  properties: any;
  map: mapboxgl.Map;
  coords: [number, number];
}) {
  const offsets: number[] = [];
  const counts = [
    props.properties.ZIKV,
    props.properties.CHIKV,
    props.properties.DENV,
    props.properties.MAYV,
    props.properties.YF,
    props.properties.WNV,
  ];
  const arboColorNames = ["ZIKV", "CHIKV", "DENV", "MAYV", "YF", "WNV"];
  let total = 0;
  for (const count of counts) {
    offsets.push(total);
    total = total + count;
  }
  const fontSize =
    total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
  const piChartOuterRadius = total >= 50 ? 50 : total >= 25 ? 32 : total >= 10 ? 24 : 18;
  const piChartInnerRadius = Math.round(r * 0.6);
  const piChartDiameter = r * 2;

  // for some reason tailwind is not being recognized here
  // Current country and city are not working on the popup need to add that in
  let popupHTML = `
    <div style="display: flex; flex-direction: column; padding: 1rem;">
        <div style="display: flex; flex-direction: column; padding-bottom: 0.5rem">
            <div style="font-size: 1.125rem; font-weight: bold;">Estimate Count</div>
            <div style="font-size: 1rem">${props.properties.country}</div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: space-between; padding-bottom: 0.5rem">
            <div style="display: flex; flex-direction: column;">`;
  if (props.properties.ZIKV > 0)
    popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem; padding-left: 5px; border-left: 5px solid ${pathogenColors["ZIKV"]}">ZIKV</div>`;
  if (props.properties.CHIKV > 0)
    popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem; padding-left: 5px; border-left: 5px solid ${pathogenColors["CHIKV"]}">CHIKV</div>`;
  if (props.properties.DENV > 0)
    popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem; padding-left: 5px; border-left: 5px solid ${pathogenColors["DENV"]}">DENV</div>`;
  if (props.properties.MAYV > 0)
    popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem; padding-left: 5px; border-left: 5px solid ${pathogenColors["MAYV"]}">MAYV</div>`;
  if (props.properties.YF > 0)
    popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem; padding-left: 5px; border-left: 5px solid ${pathogenColors["YF"]}">YF</div>`;
  if (props.properties.WNV > 0)
    popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem; padding-left: 5px; border-left: 5px solid ${pathogenColors["WNV"]}">WNV</div>`;
  popupHTML += `</div>
            <div style="display: flex; flex-direction: column;">`;

  if (props.properties.ZIKV > 0)
    popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem;">${props.properties.ZIKV}</div>`;
  if (props.properties.CHIKV > 0)
    popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem;">${props.properties.CHIKV}</div>`;
  if (props.properties.DENV > 0)
    popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem;">${props.properties.DENV}</div>`;
  if (props.properties.MAYV > 0)
    popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem;">${props.properties.MAYV}</div>`;
  if (props.properties.YF > 0)
    popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem;">${props.properties.YF}</div>`;
  if (props.properties.WNV > 0)
    popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem;">${props.properties.WNV}</div>`;

  popupHTML += `</div>
        </div>
        <div style="font-size: 0.875rem; font-weight: 300; text: center">Click to zoom in</div>

    </div>`;

  // Cannot use the react-gl Popup method as we need to use useRef to access the underlying method
  // and we cannot do that when these popups are loaded dynamically and not statically.
  const popup = new mapboxgl.Popup({
    offset: [0, -7],
    closeOnClick: false,
  });

  const onMouseEnter = (event: any) => {
    event.target.style.cursor = "zoom-in";
    popup.setLngLat(props.coords).setHTML(popupHTML).addTo(props.map);
  };

  const onMouseLeave = (event: any) => {
    event.target.style.cursor = "";
    popup.remove();
  };

  return (
    <svg
      width={w}
      height={w}
      viewBox={`0 0 ${w} ${w}`}
      text-anchor="middle"
      style={{ font: `${fontSize}px sans-serif`, display: "block" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => {popup.remove()}}
    >
      {counts.map((count, i) =>
        donutSegment(
          offsets[i] / total,
          (offsets[i] + count) / total,
          r,
          r0,
          pathogenColors[arboColorNames[i]]
        )
      )}
      <circle cx={r} cy={r} r={r0} fill="white" />
      <text dominant-baseline="central" transform={`translate(${r}, ${r})`}>
        {total.toLocaleString()}
      </text>
    </svg>
  );
}

export function donutSegment(
  start: number,
  end: number,
  r: number,
  r0: number,
  color: string
) {
  if (end - start === 1) end -= 0.00001;
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (end - 0.25);
  const x0 = Math.cos(a0),
    y0 = Math.sin(a0);
  const x1 = Math.cos(a1),
    y1 = Math.sin(a1);
  const largeArc = end - start > 0.5 ? 1 : 0;

  // draw an SVG path
  return (
    <path
      d={`M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
        r + r * y0
      } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${
        r + r0 * x1
      } ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${
        r + r0 * y0
      }`}
      fill={color}
    />
  );
}


export function createClusterPointMarker(props: {
  element: React.ReactNode;
  coords: [number, number];
  id: string;
  map: mapboxgl.Map;
}) {
  const onClick = (event: any) => {
    const coordinates = event.target.getLngLat();
    props.map.flyTo({
      center: [coordinates.lng, coordinates.lat],
      zoom: props.map.getZoom() + 2,
    });
  };

  return (
    <Marker
      key={props.id}
      longitude={props.coords[0]}
      latitude={props.coords[1]}
      onClick={onClick}
    >
      {props.element}
    </Marker>
  );
}

// markers is a cached collection of already existing markers. 
export function computeClusterMarkers(props: {
  features: mapboxgl.MapboxGeoJSONFeature[];
  markers: MarkerCollection;
  map: mapboxgl.Map;
}): MarkerCollection {
  const newMarkers: MarkerCollection = {};
  // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
  // and add it to the map if it's not there already
  for (const feature of props.features) {
    // A geometryCollection does not have a coordinate property. Instead it has a collection of geometries.
    // I do not believe we will be dealing with this use case atm

    if (feature.geometry.type === "Point") {
      const coords = feature.geometry.coordinates;
      const properties = feature.properties;
      if (properties && properties.cluster && coords.length >= 2) {
        const id = properties.cluster_id;
        let marker = props.markers[id];
        if (!marker) {
          const el = createDonutChartAndHoverPopup({
            properties: properties,
            map: props.map,
            coords: [coords[0], coords[1]],
          });
          marker = props.markers[id] = createClusterPointMarker({
            element: el,
            coords: [coords[0], coords[1]],
            id: id,
            map: props.map,
          });
        }
        if (marker) {
          newMarkers[id] = marker;
        }
      }
    } else {
      console.error("feature is not a point: ", feature);
    }
  }
  return newMarkers;
}
