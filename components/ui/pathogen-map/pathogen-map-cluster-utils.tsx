import { GenericMapPopUpWidth, genericMapPopUpWidthEnumToWidthPxMap } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { MarkerCollection } from "@/components/ui/pathogen-map/pathogen-map";
import { Browser, detectBrowser } from "@/lib/detect-browser";
import mapboxgl from "mapbox-gl";
import React from "react";
import { Marker } from "react-map-gl";

// code for creating an SVG donut chart from feature properties
export function createDonutChartAndHoverPopup<
  TClusterPropertyKey extends string
>(props: {
  properties: Record<TClusterPropertyKey, number>;
  headerText: string;
  popUpWidth: GenericMapPopUpWidth;
  validClusterPropertyKeys: TClusterPropertyKey[];
  clusterPropertyKeysIncludedInSum: TClusterPropertyKey[];
  clusterPropertyToColourMap: Record<TClusterPropertyKey, string>;
  map: mapboxgl.Map;
  coords: [number, number];
}) {
  const counts = props.validClusterPropertyKeys.map((propertyKey) => ({
    count: props.properties[propertyKey] ?? 0,
    propertyKey
  }));
  let total = 0;
  const countsWithOffsets = counts.map(({ count, propertyKey }) => {
    if(!props.clusterPropertyKeysIncludedInSum.includes(propertyKey)) {
      return {
        offset: 0,
        count,
        propertyKey
      }
    }

    const offset = total;
    total = total + count;

    return {
      offset,
      count,
      propertyKey
    }
  })

  console.log('counts', counts)

  const fontSize =
    total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
  const piChartOuterRadius = total >= 50 ? 50 : total >= 25 ? 32 : total >= 10 ? 24 : 18; // r
  const piChartInnerRadius = Math.round(piChartOuterRadius * 0.6); // r0
  const piChartDiameter = piChartOuterRadius * 2; // w

  // for some reason tailwind is not being recognized here
  // Current country and city are not working on the popup need to add that in
  // TODO: need to add in popup HTML: <div style="font-size: 1rem">${props.properties.country}</div>

  const popUpWidthStringPx = props.popUpWidth !== GenericMapPopUpWidth.AUTO
    ? `${genericMapPopUpWidthEnumToWidthPxMap[props.popUpWidth].toString()}px`
    : undefined

  let popupHTML = `
    <div style="display: flex; flex-direction: column; padding: 1rem;${popUpWidthStringPx ? `width: ${popUpWidthStringPx}` : ""}" class=\"bg-white/60 backdrop-blur-md\">
        <div style="display: flex; flex-direction: column; padding-bottom: 0.5rem">
            <div style="font-size: 1.125rem; font-weight: bold;">${props.headerText}</div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: space-between; padding-bottom: 0.5rem">
            <div style="display: flex; flex-direction: column;">`;
            props.validClusterPropertyKeys.forEach((clusterPropertyKey) => {
              if(props.properties[clusterPropertyKey] > 0) {
                popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem; padding-left: 5px;${
                  props.clusterPropertyKeysIncludedInSum.includes(clusterPropertyKey)
                    ? `border-left: 5px solid ${props.clusterPropertyToColourMap[clusterPropertyKey]}`
                    : `margin-left: 5px`
                }">${clusterPropertyKey}</div>`;
              }
            })
  popupHTML += `</div>
            <div style="display: flex; flex-direction: column;">`;

            props.validClusterPropertyKeys.forEach((clusterPropertyKey) => {
              if(props.properties[clusterPropertyKey] > 0) {
                popupHTML += `<div style="font-size: 0.875rem; font-weight: 300; margin-bottom: 0.25rem;">${props.properties[clusterPropertyKey]}</div>`;
              }
            })
  
  popupHTML += `</div>
        </div>
        <div style="font-size: 0.875rem; font-weight: 300; text: center">Click to zoom in</div>

    </div>`;

  // Cannot use the react-gl Popup method as we need to use useRef to access the underlying method
  // and we cannot do that when these popups are loaded dynamically and not statically.
  const popupOffsets: {[key: string]: [number, number]} = {
    'top': [0, piChartOuterRadius],
    'top-left': [0, piChartOuterRadius],
    'top-right': [0, piChartOuterRadius],
    'bottom': [0, -piChartOuterRadius],
    'bottom-left': [0, -piChartOuterRadius],
    'bottom-right': [0, -piChartOuterRadius],
    'left': [piChartOuterRadius, 0],
    'right': [-piChartOuterRadius, 0]
};

  const popup = new mapboxgl.Popup({
    offset: popupOffsets,
    className: detectBrowser() === Browser.CHROME ? "[&>*]:!bg-transparent" : "",
    closeOnClick: false,
    focusAfterOpen: false,
    maxWidth: popUpWidthStringPx
  });

  const onMouseEnter = (event: any) => {
    event.target.style.cursor = "zoom-in";
    popup.setLngLat(props.coords).setHTML(popupHTML).addTo(props.map);
  };

  const onMouseLeave = (event: any) => {
    event.target.style.cursor = "";
    popup.remove();
  };

  return {
    properties: {
      ...props.properties,
      longitude: props.coords[0],
      latitude: props.coords[1],
    },
    element: (
      <svg
        width={piChartDiameter}
        height={piChartDiameter}
        viewBox={`0 0 ${piChartDiameter} ${piChartDiameter}`}
        textAnchor="middle"
        style={{ font: `${fontSize}px sans-serif`, display: "block" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={(e) => {e.preventDefault(); e.stopPropagation()}}
        onClick={() => {popup.remove()}}
      >
        {countsWithOffsets.map(({ count, propertyKey, offset }) =>
          props.clusterPropertyKeysIncludedInSum.includes(propertyKey)
            ? donutSegment(
              offset / total,
              (offset + count) / total,
              piChartOuterRadius,
              piChartInnerRadius,
              props.clusterPropertyToColourMap[propertyKey],
              `map-cluster-svg-path-${propertyKey}-${count}-${offset}`
            )
            : null
        )}
        <circle cx={piChartOuterRadius} cy={piChartOuterRadius} r={piChartInnerRadius} fill="white"/>
        <text dominantBaseline="central" transform={`translate(${piChartOuterRadius}, ${piChartOuterRadius})`}>
          {total.toLocaleString()}
        </text>
      </svg>
    )
  };
}

export function donutSegment(
  start: number,
  end: number,
  r: number,
  r0: number,
  color: string,
  key: string
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
      key={key}
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
export const computeClusterMarkers = <
  TClusterPropertyKey extends string
>(props: {
  features: GeoJSON.Feature<
    GeoJSON.Geometry,
    { cluster: boolean, cluster_id: string } & Record<TClusterPropertyKey, number>
  >[];
  headerText: string;
  popUpWidth: GenericMapPopUpWidth;
  markers: MarkerCollection<TClusterPropertyKey>;
  validClusterPropertyKeys: TClusterPropertyKey[];
  clusterPropertyKeysIncludedInSum: TClusterPropertyKey[];
  clusterPropertyToColourMap: Record<TClusterPropertyKey, string>;
  map: mapboxgl.Map;
}): MarkerCollection<TClusterPropertyKey> => {
  const newMarkers: MarkerCollection<TClusterPropertyKey> = {};
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

        const { element, properties: markerProperties } = createDonutChartAndHoverPopup({
          properties: properties,
          headerText: props.headerText,
          popUpWidth: props.popUpWidth,
          validClusterPropertyKeys: props.validClusterPropertyKeys,
          clusterPropertyKeysIncludedInSum: props.clusterPropertyKeysIncludedInSum,
          clusterPropertyToColourMap: props.clusterPropertyToColourMap,
          map: props.map,
          coords: [coords[0], coords[1]],
        });

        if(
          !!props.markers[id] &&
          markerProperties.latitude === props.markers[id].properties.latitude &&
          markerProperties.longitude === props.markers[id].properties.longitude &&
          props.validClusterPropertyKeys.every((propertyKey) => markerProperties[propertyKey] === props.markers[id].properties[propertyKey])
        ) {
          newMarkers[id] = props.markers[id]
        }
        else {
          const marker = createClusterPointMarker({
            element: element,
            coords: [coords[0], coords[1]],
            id: id,
            map: props.map,
          });
          newMarkers[id] = {
            properties: markerProperties,
            element: marker
          }
        }
      }
    } else {
      console.error("feature is not a point: ", feature);
    }
  }
  return newMarkers;
}
