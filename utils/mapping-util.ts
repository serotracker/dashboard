import { Expressions } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";
import mapboxgl from "mapbox-gl";

// Params: url - to an esri vector tile service
// Returns: Modified style object with attributes for Mapbox GL JS compatability
async function prepare(url: string) {
  const styleUrl = url + "/resources/styles/root.json";

  let res = await fetch(styleUrl);
  if (res.status !== 200) {
    const error_msg = res.json();
    console.error(error_msg);
    return;
  } else {
    const fetchedStyle = await res.json();
    fetchedStyle.sprite = url + "/resources/sprites/sprite";
    fetchedStyle.glyphs = url + "/resources/fonts/{fontstack}/{range}.pbf";
    fetchedStyle.sources.esri = {
      type: "vector",
      tiles: [url + "/tile/{z}/{y}/{x}.pbf"],
      maxzoom: 23,
    };

    return fetchedStyle;
  }
}

// Params: url - to an esri vector tile service
// Returns: Mapbox style object with applied serotracker styling expressions
export async function getEsriVectorSourceStyle(url: string) {
  let style = await prepare(url);

  var source = style.sources.esri as mapboxgl.VectorSource;

  const l = style.layers[0] as mapboxgl.Layer;
  if (l.id === "Countries") {
    source.promoteId = { Countries: "CODE" };
    // the map type for this layer changed to a line
    // had to change to a fill and edit other properties to make the layer show.
    l.type = "fill";
    l.paint = Expressions.CountriesPaint as any;
    l.layout = Expressions.CountriesLayout as any;
  }

  return style;
}
