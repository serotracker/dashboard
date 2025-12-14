import { ColourBucket, generateMapColourBuckets } from "@/components/ui/pathogen-map/country-highlight-layers/generate-map-colour-buckets";
import { createContext, useEffect, useState, useMemo } from "react";
import { Layer, Source } from "react-map-gl/mapbox";
import { rose } from "tailwindcss/colors";

type OropoucheCaseGeoJsonFeature = {
  type: "Feature",
  properties: {
    provinceISOId: string;
    countryAlphaThreeCode: string;
    cases: number;
    defaultColourHexCode: string;
    percentageOfMaximumValue: number;
  },
  geometry: {
    type: "Polygon",
    coordinates: Array<Array<[ number, number ]>>
  }
} & Record<string, unknown>;

export interface ArbovirusOropoucheCasesDataContextType {
  oropoucheCasesGeoJSONData: {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84"
      }
    },
    features: Array<OropoucheCaseGeoJsonFeature>;
  } | null;
  oropoucheCaseLayerColourBuckets: Array<ColourBucket<OropoucheCaseGeoJsonFeature>>
  oropoucheCaseMapboxLayer: React.ReactNode | null
}

const initialArbovirusOropoucheCasesDataContext = {
  oropoucheCasesGeoJSONData: null,
  oropoucheCaseMapboxLayer: null,
  oropoucheCaseLayerColourBuckets: []
};

export const ArbovirusOropoucheCasesDataContext = createContext<
  ArbovirusOropoucheCasesDataContextType
>(initialArbovirusOropoucheCasesDataContext);

interface ArbovirusOropoucheCasesDataProviderProps {
  children: React.ReactNode;
}

export const ArbovirusOropoucheCasesDataProvider = (props: ArbovirusOropoucheCasesDataProviderProps) => {
  const [ oropoucheCasesGeoJSONData, setOropoucheCasesGeoJSONData ] = useState<ArbovirusOropoucheCasesDataContextType['oropoucheCasesGeoJSONData'] | null>(null);

  useEffect(() => {
    if(oropoucheCasesGeoJSONData === null && process.env.NEXT_PUBLIC_OROPOUCHE_ENABLED) {
      fetch('https://raw.githubusercontent.com/serotracker/iit-backend-v2/refs/heads/main/oropouche-cases-geojson.json')
        .then((response): Promise<ArbovirusOropoucheCasesDataContextType['oropoucheCasesGeoJSONData']> => response.json())
        .then((responseJson) => setOropoucheCasesGeoJSONData(responseJson))
    }
  }, [ oropoucheCasesGeoJSONData, setOropoucheCasesGeoJSONData, process ]);
  
  const { mapColourBuckets: oropoucheCaseLayerColourBuckets } = useMemo(() => {
    if(!oropoucheCasesGeoJSONData) {
      return {
        mapColourBuckets: []
      }
    }

    return generateMapColourBuckets({
      idealBucketCount: 8,
      smallestValuePaint: {
        fill: rose['100'],
        opacity: 0.6
      },
      largestValuePaint: {
        fill: rose['700'],
        opacity: 0.8
      },
      data: oropoucheCasesGeoJSONData.features,
      dataPointToValue: (feature) => feature.properties.cases
    })
  }, [ oropoucheCasesGeoJSONData ])

  const oropoucheCaseMapboxLayer = useMemo(() => {
    if(oropoucheCasesGeoJSONData === null) {
      return null;
    }

    return (
      <Source
        id='oropouche-cases-map-source'
        type='geojson'
        data={oropoucheCasesGeoJSONData}
      >
        <Layer
          id='oropouche-cases-map-layer'
          source='oropouche-cases-map-source'
          type='fill'
          paint={{
            "fill-color": oropoucheCaseLayerColourBuckets.length > 0 ? [
              'match',
              ['get', 'provinceISOId'],
              ...oropoucheCaseLayerColourBuckets
                .flatMap((colourBucket): string[] => (
                  colourBucket.dataPoints.flatMap((feature): [string, string] => [feature.properties.provinceISOId, colourBucket.fill ])
                )),
              '#ffffff'
            ] : '#ffffff',
            "fill-opacity": oropoucheCaseLayerColourBuckets.length > 0 ? [
              'match',
              ['get', 'provinceISOId'],
              ...oropoucheCaseLayerColourBuckets
                .flatMap((colourBucket): Array<string | number> => (
                  colourBucket.dataPoints.flatMap((feature): [string, number] => [feature.properties.provinceISOId, colourBucket.opacity ])
                )),
              1
            ] : 1,
            "fill-outline-color": "#000000",
          }}
        />
      </Source>
    );
  }
  , [ oropoucheCasesGeoJSONData, oropoucheCaseLayerColourBuckets ])

  return (
    <ArbovirusOropoucheCasesDataContext.Provider value={{
      oropoucheCasesGeoJSONData,
      oropoucheCaseMapboxLayer,
      oropoucheCaseLayerColourBuckets
    }}>
      {props.children}
    </ArbovirusOropoucheCasesDataContext.Provider>
  );
}