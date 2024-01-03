export const MapSymbology = {
    StudyFeature: {
        National: {
            Color: '#094180',
            Size: 11
        },
        Regional: {
            Color: '#F19E66',
            Size: 9
        },
        Local: {
            Color: '#E15759',
            Size: 6
        },
        Sublocal: {
            Color: '#E15759',
            Size: 5
        },
        Default: {
            Color: '#FFFFFF',
            Size: 0
        }
    },
    CountryFeature: {
        IsHighlighted: {
            Color: '#b0c8d4'
        },
        HasData: {
            Color: '#97b1bd',
            Opacity: 0.5 
        },
        Disputed: {
            Color: '#E1E1E1',
            Opacity: 1 
        },
        Shaded: {
            Color: '#707070',
        },
        Default: {
            Color: '#FFFFFF',
            Opacity: 0 
        }
    },
    Border: {
        Color: "#455a64"
    }
}

export const MapResources = {
    WHO_BASEMAP : "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Polygon_Basemap_no_labels/VectorTileServer",
    WHO_COUNTRY_VECTORTILES : "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/Countries/VectorTileServer"
}


export const Expressions = {
    CountriesPaint : {
    'fill-color': [
      'case',
      ['boolean', ['feature-state', 'isHighlighted'], true], MapSymbology.CountryFeature.IsHighlighted.Color,
      ['boolean', ['feature-state', 'hasData'], true], MapSymbology.CountryFeature.HasData.Color,
      MapSymbology.CountryFeature.Default.Color
    ],
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hasData'], false], MapSymbology.CountryFeature.HasData.Opacity,
      MapSymbology.CountryFeature.Default.Opacity
    ]
    },
    CountriesLayout : {
        'visibility': "visible"
    }
};