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
  zika: "mapbox://serotracker.7qe2zkgd",
  dengue2015: "mapbox://serotracker.5wobnon2",
  dengue2050: "mapbox://serotracker.9lzerqbc",
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
          "raster-opacity": 0.8,
          "raster-fade-duration": 0,
        }}
        beforeId={props.popupLayerId}
      />
    </Source>
  );
}
