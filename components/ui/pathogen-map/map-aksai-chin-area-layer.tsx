import { Source, Layer, LayerProps } from "react-map-gl";
import { PaintForCountries } from "./pathogen-map";

export interface MapAksaiChinAreaLayerProps {
  paint: PaintForCountries;
  positionedUnderLayerWithId: string | undefined;
}

export const MapAksaiChinAreaLayer = (props: MapAksaiChinAreaLayerProps) => {
  const { paint } = props;

  const fillForChina = paint.countryData.find((dataPoint) => dataPoint.countryAlphaThreeCode === 'CHN')?.fill;

  return (
    <Source
      id='aksai-chin-stripe-source'
      type='geojson'
      data={{
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [77.5,33.5],
                  [78,33.5],
                  [77.5,34],
                  [77.5,33.5]
                ]
              ]
            },
            "properties": {
              "zone": "zone-one"
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [78,33.5],
                  [77.5,34],
                  [77.5,34.5],
                  [78.5,33.5],
                  [78,33.5]
                ]
              ]
            },
            "properties": {
              "zone": "zone-two"
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [78.5,33.5],
                  [77.5,34.5],
                  [77.5,35],
                  [79,33.5],
                  [78.5,33.5]
                ]
              ]
            },
            "properties": {
              "zone": "zone-one"
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [79,33.5],
                  [77.5,35],
                  [77.5,35.5],
                  [79.5,33.5],
                  [79,33.5]
                ]
              ]
            },
            "properties": {
              "zone": "zone-two"
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                    [79.5,33.5],
                    [77.5,35.5],
                    [77.5,36],
                    [80,33.5],
                    [79.5,33.5]
                  ]
              ]
            },
            "properties": {
              "zone": "zone-one"
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [80,33.5],
                  [77.5,36],
                  [77.5,36.5],
                  [80.5,33.5],
                  [80,33.5]
                ]
              ]
            },
            "properties": {
              "zone": "zone-two"
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [80.5,33.5],
                  [77.5,36.5],
                  [77.5,37],
                  [81,33.5],
                  [80.5,33.5]
                ]
              ]
            },
            "properties": {
              "zone": "zone-one"
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [81,33.5],
                  [77.5,37],
                  [77.5,37.5],
                  [81.5,33.5],
                  [81,33.5]
                ]
              ]
            },
            "properties": {
              "zone": "zone-two"
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [81.5,33.5],
                  [77.5,37.5],
                  [77.5,38],
                  [82,33.5],
                  [81.5,33.5]
                ]
              ]
            },
            "properties": {
              "zone": "zone-one"
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [82,33.5],
                  [77.5,38],
                  [77.5,38.5],
                  [82.5,33.5],
                  [82,33.5]
                ]
              ]
            },
            "properties": {
              "zone": "zone-two"
            }
          }
        ]
      }}
    >
      <Layer
        id={"aksai-chin-stripe-layer"}
        type="fill"
        source="aksai-chin-stripe-source"
        paint={{
          'fill-color': [
            'match',
            ['get', "zone"],
            'zone-one',
            fillForChina ?? '#E1E1E1',
            '#E1E1E1'
          ],
          'fill-opacity': 1,
          'fill-outline-color': "#000000",
        }}
        minzoom={0}
        maxzoom={22}
      />
    </Source>
  )
};