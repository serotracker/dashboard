import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { useContext } from "react";
import { Layer, Source } from "react-map-gl";

type Esms = "zika" | "dengue2015" | "dengue2050";

const esmIds: Record<Esms, string> = {
  zika: "zika_esm_layer",
  dengue2015: "dengue_2015_esm_layer",
  dengue2050: "dengue_2050_esm_layer",
};

const esmUrls: Record<Esms, string> = {
  zika: "mapbox://serotracker.2j21tlhy",
  dengue2015: "mapbox://serotracker.7fq6ayzs",
  dengue2050: "mapbox://serotracker.006nrtto",
};

export function EsmMapSourceAndLayer(props: {popupLayerId?: string}) {
  const state = useContext(ArboContext);

  if(!state.selectedFilters.esm || state.selectedFilters.esm.length === 0) return null;

  const selectedEsms = state.selectedFilters.esm[0];

  return (
    <Source
      id={"esm_source"}
      type="raster"
      url={esmUrls[selectedEsms as Esms]}
    >
      <Layer
        id={esmIds[selectedEsms as Esms]}
        type="raster"
        source="esm_source"
        minzoom={0}
        maxzoom={22}
        paint={{
          "raster-color": [
            "interpolate",
            ["linear"],
            ["raster-value"],
            0,
            "rgba(255,255,229,0.5)",
            0.11,
            "rgba(255,247,188,0.5)",
            0.22,
            "rgba(254,227,145,0.5)",
            0.33,
            "rgba(254,196,79,0.5)",
            0.44,
            "rgba(254,153,41,0.5)",
            0.55,
            "rgba(236,112,20,0.5)",
            0.66,
            "rgba(204,76,2,0.5)",
            0.77,
            "rgba(153,52,4,0.5)",
            0.88,
            "rgba(102,37,6,0.5)",
            1,
            "rgba(54,2,4,0.5)"
          ],
          "raster-opacity": 1,
          "raster-fade-duration": 0,
        }}
        beforeId='jammu-kashmir-layer'
      />
    </Source>
  );
}