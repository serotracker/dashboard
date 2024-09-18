import { createContext, useEffect, useState, useMemo } from "react";
import { Layer, Marker, Source } from "react-map-gl";

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  cursor: 'pointer',
  fill: '#d00',
  stroke: 'none'
};

interface PinProps {
  size?: number | undefined;
}

const Pin = (input: PinProps | undefined) => {
  const size = input?.size ?? 32;

  return (
    <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
      <path d={ICON} />
      <text x='2' y='20' style={{fill: 'black'}}>La Paz</text>
      <text x='20' y='20' style={{fill: 'black'}}>100 Cases</text>
    </svg>
  );
}

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

  const oropoucheCaseCountryColourLayer = useMemo(() => {
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
  }, [ oropoucheCasesGeoJSONData ]);

  const oropouchePins = useMemo(() => {
    if(oropoucheCasesGeoJSONData === null) {
      return null;
    }

    return oropoucheCasesGeoJSONData.features.map((feature) => {
      const allLatitudes = feature.geometry.coordinates.at(0)?.map((point) => point[1]) ?? [];
      const allLongitudes = feature.geometry.coordinates.at(0)?.map((point) => point[0]) ?? [];

      if(allLatitudes.length < 0 || allLongitudes.length < 0) {
        return undefined;
      } 
      const maximumLatitude = Math.max(...allLatitudes);
      const minimumLatitude = Math.min(...allLatitudes);
      const maximumLongitude = Math.max(...allLongitudes);
      const minimumLongitude = Math.min(...allLongitudes);

      const middleLatitude = ((maximumLatitude - minimumLatitude) / 2) + minimumLatitude;
      const middleLongitude = ((maximumLongitude - minimumLongitude) / 2) + minimumLongitude;

      if(isNaN(middleLatitude) || isNaN(middleLongitude)) {
        return undefined;
      }

      return (
        <Marker
          key={`marker-${feature.properties.countryAlphaThreeCode}-${feature.properties.provinceISOId}`}
          longitude={middleLongitude}
          latitude={middleLatitude}
          anchor="bottom"
        >
          <Pin/>
        </Marker>
      )
    }).filter((feature): feature is NonNullable<typeof feature> => !!feature)

  }, [ oropoucheCasesGeoJSONData ]);

  const oropoucheCaseMapboxLayer = useMemo(() => (<>
    {oropoucheCaseCountryColourLayer}
    {oropouchePins}
  </>), [ oropoucheCaseCountryColourLayer, oropouchePins ]);

  return (
    <ArbovirusOropoucheCasesDataContext.Provider value={{
      oropoucheCasesGeoJSONData,
      oropoucheCaseMapboxLayer
    }}>
      {props.children}
    </ArbovirusOropoucheCasesDataContext.Provider>
  );
}