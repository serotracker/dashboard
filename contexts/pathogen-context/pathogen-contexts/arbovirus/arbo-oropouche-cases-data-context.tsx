import { createContext, useEffect, useState, useMemo } from "react";
import { Layer, Source } from "react-map-gl";

export interface ArbovirusOropoucheCasesDataContextType {
  oropoucheCasesGeoJSONData: {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84"
      }
    },
    features: Array<{
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
    }>
  } | null;
  oropoucheCaseMapboxLayer: React.ReactNode | null
}

const initialArbovirusOropoucheCasesDataContext = {
  oropoucheCasesGeoJSONData: null,
  oropoucheCaseMapboxLayer: null
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
            "fill-color": oropoucheCasesGeoJSONData.features.length > 0 ? [
              'match',
              ['get', 'provinceISOId'],
              ...oropoucheCasesGeoJSONData.features
                .flatMap((feature): [string, string] => [feature.properties.provinceISOId, feature.properties.defaultColourHexCode]),
              '#ffffff'
            ] : '#ffffff',
            "fill-opacity": 1,
            "fill-outline-color": "#000000",
          }}
        />
      </Source>
    );
  }
  , [ oropoucheCasesGeoJSONData ])

  return (
    <ArbovirusOropoucheCasesDataContext.Provider value={{
      oropoucheCasesGeoJSONData,
      oropoucheCaseMapboxLayer
    }}>
      {props.children}
    </ArbovirusOropoucheCasesDataContext.Provider>
  );
}