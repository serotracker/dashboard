import { useContext, useMemo } from "react";
import { DataTable, RowExpansionConfiguration, TableHeaderType } from "@/components/ui/data-table/data-table";
import { columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { DataTableColumnConfigurationEntryType } from "@/components/ui/data-table/data-table-column-config";
import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/sc2-context";
import { GbdSubRegion, WhoRegion } from "@/gql/graphql";
import { gbdSubRegionToLabelMap, gbdSuperRegionToLabelMap, isGbdSubRegion, isGbdSuperRegion } from "@/lib/gbd-regions";
import { getLabelForUNRegion, isUNRegion } from "@/lib/un-regions";
import { RechartsVisualization } from "@/components/customs/visualizations/recharts-visualization";
import { ModelledSarsCov2SeroprevalenceContext } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/modelled-sarscov2-seroprevalence-context";
import { SarsCov2VisualizationId, getUrlParameterFromVisualizationId, useVisualizationPageConfiguration } from "../../visualizations/visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { useDataTableMapViewingHandler } from "./use-data-table-map-viewing-handler";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";
import { ModelledSeroprevalenceByCountryGraph } from "../(visualizations)/modelled-seroprevalence-by-country";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { ModalState, ModalType } from "@/components/ui/modal/modal";

const ageGroupToSortOrderMap: Record<string, number | undefined> = {
  'Children and Youth (0-17 years)': 1,
  'Adults (18-64 years)': 2,
  'Seniors (65+ years)': 3,
  'Multiple groups': 4
};

const riskOfBiasToSortOrderMap: Record<string, number | undefined> = {
  'Missing': 1,
  'High': 2,
  'Moderate': 3,
  'Low': 4,
};

const scopeToSortOrderMap: Record<string, number | undefined> = {
  'Local': 1,
  'Regional': 2,
  'National': 3
};

const sarsCov2ColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.LINK as const,
  fieldName: 'estimateName',
  label: 'Estimate Name',
  isHideable: false,
  isFixed: true,
  size: 700,
  fieldNameForLink: 'url'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'whoRegion',
  label: 'WHO Region',
  valueToColourSchemeClassnameMap: {
    [WhoRegion.Afr]: "bg-who-region-afr",
    [WhoRegion.Amr]: "bg-who-region-amr",
    [WhoRegion.Emr]: "bg-who-region-emr",
    [WhoRegion.Eur]: "bg-who-region-eur",
    [WhoRegion.Sear]: "bg-who-region-sear",
    [WhoRegion.Wpr]: "bg-who-region-wpr text-white"
  },
  defaultColourSchemeClassname: 'bg-sky-100'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'unRegion',
  label: 'UN Region',
  valueToDisplayLabel: (unRegion: string) => isUNRegion(unRegion) ? getLabelForUNRegion(unRegion) : unRegion
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'gbdSuperRegion',
  label: 'GBD Super Region',
  valueToDisplayLabel: (gbdSuperRegion: string) => isGbdSuperRegion(gbdSuperRegion) ? gbdSuperRegionToLabelMap[gbdSuperRegion] : gbdSuperRegion
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'gbdSubRegion',
  label: 'GBD Sub Region',
  valueToColourSchemeClassnameMap: {
    [GbdSubRegion.HighIncomeSubregionAsiaPacific]: "bg-gdb-sub-region-high-income-subregion-asia-pacific",
    [GbdSubRegion.HighIncomeSubregionAustralasia]: "bg-gdb-sub-region-high-income-subregion-australasia text-white",
    [GbdSubRegion.HighIncomeSubregionNorthAmerica]: "bg-gdb-sub-region-high-income-subregion-north-america",
    [GbdSubRegion.HighIncomeSubregionSouthernLatinAmerica]: "bg-gdb-sub-region-high-income-subregion-southern-latin-america",
    [GbdSubRegion.HighIncomeSubregionWesternEurope]: "bg-gdb-sub-region-high-income-subregion-western-europe",
    [GbdSubRegion.CentralEuropeEasternEuropeAndCentralAsiaSubregionCentralAsia]: "bg-gdb-sub-region-central-europe-eastern-europe-and-central-asia-subregion-central-asia",
    [GbdSubRegion.CentralEuropeEasternEuropeAndCentralAsiaSubregionCentralEurope]: "bg-gdb-sub-region-central-europe-eastern-europe-and-central-asia-subregion-central-europe",
    [GbdSubRegion.CentralEuropeEasternEuropeAndCentralAsiaSubregionEasternEurope]: "bg-gdb-sub-region-central-europe-eastern-europe-and-central-asia-subregion-eastern-europe",
    [GbdSubRegion.SubSaharanAfricaSubregionCentral]: "bg-gdb-sub-region-sub-saharan-africa-subregion-central",
    [GbdSubRegion.SubSaharanAfricaSubregionEastern]: "bg-gdb-sub-region-sub-saharan-africa-subregion-eastern",
    [GbdSubRegion.SubSaharanAfricaSubregionSouthern]: "bg-gdb-sub-region-sub-saharan-africa-subregion-southern",
    [GbdSubRegion.SubSaharanAfricaSubregionWestern]: "bg-gdb-sub-region-sub-saharan-africa-subregion-western",
    [GbdSubRegion.LatinAmericaAndCaribbeanSubregionAndean]: "bg-gdb-sub-region-latin-america-and-caribbean-subregion-andean",
    [GbdSubRegion.LatinAmericaAndCaribbeanSubregionCaribbean]: "bg-gdb-sub-region-latin-america-and-caribbean-subregion-caribbean",
    [GbdSubRegion.LatinAmericaAndCaribbeanSubregionCentral]: "bg-gdb-sub-region-latin-america-and-caribbean-subregion-central",
    [GbdSubRegion.LatinAmericaAndCaribbeanSubregionTropical]: "bg-gdb-sub-region-latin-america-and-caribbean-subregion-tropical text-white",
    [GbdSubRegion.SouthAsiaSubregionSouthAsia]: "bg-gdb-sub-region-south-asia-subregion-south-asia",
    [GbdSubRegion.SouthEastAsiaEastAsiaAndOceaniaSubregionEastAsia]: "bg-gdb-sub-region-south-east-asia-east-asia-and-oceania-subregion-east-asia",
    [GbdSubRegion.SouthEastAsiaEastAsiaAndOceaniaSubregionOceania]: "bg-gdb-sub-region-south-east-asia-east-asia-and-oceania-subregion-oceania text-white",
    [GbdSubRegion.SouthEastAsiaEastAsiaAndOceaniaSubregionSouthEastAsia]: "bg-gdb-sub-region-south-east-asia-east-asia-and-oceania-subregion-south-east-asia",
    [GbdSubRegion.NorthAfricaAndMiddleEastSubregionNorthAfricaAndMiddleEast]: "bg-gdb-sub-region-north-africa-and-middle-east-subregion-north-africa-and-middle-east",
  },
  defaultColourSchemeClassname: 'bg-sky-100',
  valueToDisplayLabel: (gbdSubRegion: string) => isGbdSubRegion(gbdSubRegion) ? gbdSubRegionToLabelMap[gbdSubRegion] : gbdSubRegion
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'riskOfBias',
  label: 'Risk of Bias',
  valueToColourSchemeClassnameMap: {
    "Low": "bg-risk-of-bias-low",
    "Moderate": "bg-risk-of-bias-moderate",
    "High": "bg-risk-of-bias-high",
  },
  defaultColourSchemeClassname: 'bg-sky-100',
  valueSortingFunction: (riskOfBiasA: string, riskOfBiasB: string) => (riskOfBiasToSortOrderMap[riskOfBiasA] ?? 0) - (riskOfBiasToSortOrderMap[riskOfBiasB] ?? 0),
  fallbackText: 'Not reported'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sourceType',
  label: 'Source Type',
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'scope',
  label: 'Scope',
  valueToColourSchemeClassnameMap: {
    "Local": "bg-local-study",
    "Regional": "bg-regional-study",
    "National": "bg-national-study text-white"
  },
  defaultColourSchemeClassname: 'bg-sky-100',
  valueSortingFunction: (scopeA: string, scopeB: string) => (scopeToSortOrderMap[scopeA] ?? 0) - (scopeToSortOrderMap[scopeB] ?? 0)
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'country',
  label: 'Country or Area',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'location',
  label: 'Location',
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'isotypes',
  label: 'Isotype',
  valueToColourSchemeClassnameMap: {
    'IgA': 'bg-blue-700 text-white',
    'IgD': 'bg-black text-white',
    'IgE': 'bg-green-200',
    'IgG': 'bg-yellow-400',
    'IgM': 'bg-orange-300',
    'Neutralizing': 'bg-purple-700 text-white',
    'Total Antibody': 'bg-pink-400'
  },
  defaultColourSchemeClassname: 'bg-sky-100',
  fallbackText: 'Not reported'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'antibodies',
  label: 'Antibodies',
  valueToColourSchemeClassnameMap: {
    'Envelope protein': 'bg-blue-700 text-white',
    'Membrane protein': 'bg-pink-400',
    'Multiplex': 'bg-green-200',
    'Nucleocapsid (N-protein)': 'bg-yellow-400',
    'Spike': 'bg-purple-700 text-white',
    'Whole-virus antigen': 'bg-orange-300'
  },
  defaultColourSchemeClassname: 'bg-sky-100',
  fallbackText: 'Not reported'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'testType',
  label: 'Test Type',
  valueToColourSchemeClassnameMap: {
    'CGIA/RDT': 'bg-blue-700 text-white',
    'CLIA': 'bg-green-200',
    'CMIA': 'bg-pink-400',
    'ELISA': 'bg-black text-white',
    'IFA': 'bg-red-500',
    'LFIA': 'bg-fuchsia-300',
    'Luminex': 'bg-green-700 text-white',
    'Multiple Types': 'bg-yellow-400',
    'Neutralization': 'bg-purple-700 text-white',
    'Neutralization Assay': 'bg-orange-300'
  },
  defaultColourSchemeClassname: 'bg-sky-100',
  fallbackText: 'Not reported'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'seroprevalence',
  label: 'Seroprevalence',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'numeratorValue',
  label: 'Numerator Value',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'denominatorValue',
  label: 'Sample Size',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sex',
  label: 'Sex',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'ageGroup',
  label: 'Age Group',
  valueSortingFunction: (ageGroupA: string, ageGroupB: string) => (ageGroupToSortOrderMap[ageGroupA] ?? 0) - (ageGroupToSortOrderMap[ageGroupB] ?? 0)
}, {
  type: DataTableColumnConfigurationEntryType.BOOLEAN as const,
  fieldName: 'isWHOUnityAligned',
  label: 'Unity Aligned?',
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'samplingStartDate',
  label: 'Sampling Start Date',
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'samplingEndDate',
  label: 'Sampling End Date',
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'publicationDate',
  label: 'Publication Date',
}, {
  type: DataTableColumnConfigurationEntryType.LINK_BUTTON as const,
  fieldName: 'url',
  label: 'Source',
  fieldNameForLink: 'url',
  isSortable: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'id',
  label: 'ID',
  isHideable: false,
  initiallyVisible: false
}];

const generateLocationForDataTable = (estimate: SarsCov2Estimate) => {
  const { country, county, city, state } = estimate;

  return city ?? county ?? state ?? '';
}

export const SarsCov2DataTable = () => {
  const state = useContext(SarsCov2Context);
  const {
    dataPointsForCountryAlphaThreeCodes,
    customizationSettingsForModal: modelledSeroprevalenceCustomizationSettings
  } = useContext(ModelledSarsCov2SeroprevalenceContext);
  const { sarsCov2VisualizationInformation } = useVisualizationPageConfiguration();
  const { countryAlphaThreeCodeToCountryNameMap } = useContext(CountryInformationContext)
  const { viewOnMapHandler } = useDataTableMapViewingHandler();

  const rowExpansionConfiguration: RowExpansionConfiguration<SarsCov2Estimate> = useMemo(() => ({
    enabled: true,
    generateExpandedRowStatement: ({ data, row }) => 'Clicking on this row in the table again will minimize it',
    visualization: ({ data, row, className }) => {
      const idOfEstimate = row.getValue('id');

      if(!idOfEstimate) {
        return null;
      }

      const estimate = data.find((dataPoint) => dataPoint.id === idOfEstimate);

      if(!estimate) {
        return null;
      }

      const whoRegion = estimate.whoRegion ?? undefined;
      const countryAlphaThreeCode = estimate.countryAlphaThreeCode;
      const dataPointsForCountry = dataPointsForCountryAlphaThreeCodes.find(
        (element) => element.countryAlphaThreeCode === countryAlphaThreeCode
      )?.data.map((dataPoint) => ({
        whoRegion,
        countryAlphaThreeCode,
        xAxisValue: dataPoint.xAxisValue,
        rawYAxisValue: dataPoint.rawYAxisValue,
        modelledYAxisValue: dataPoint.modelledYAxisValue
      })) ?? [];

      const countryName = countryAlphaThreeCodeToCountryNameMap[countryAlphaThreeCode] ?? "Unknown Country or Area";

      return (
        <RechartsVisualization
          className="h-full-screen"
          data={dataPointsForCountry}
          highlightedDataPoint={undefined}
          hideArbovirusDropdown={true}
          visualizationInformation={{
            ...sarsCov2VisualizationInformation[SarsCov2VisualizationId.MODELLED_SEROPREVALENCE_BY_COUNTRY],
            customizationModalConfiguration: {
              initialModalState: ModalState.CLOSED,
              disabled: false,
              modalType: ModalType.CUSTOMIZATION_MODAL,
              content: {
                paginationHoverClassname: "hover:bg-sc2virusHover",
                paginationSelectedClassname: "bg-sc2virus",
                customizationSettings: modelledSeroprevalenceCustomizationSettings,
              },
              modalBackgroundClassname: 'relative',
              modalForegroundClassname: 'w-full lg:w-11/12',
            },
            getDisplayName: () => ({
              type: VisualizationDisplayNameType.STANDARD,
              displayName: `Modelled Seroprevalence for ${countryName} over time`
            }),
            renderVisualization: () => <ModelledSeroprevalenceByCountryGraph
              data={dataPointsForCountry}
              scatterPointsVisible={true}
              legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
            />
          }}
          getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
          buttonConfig={{
            downloadButton: {
              enabled: true,
            },
            zoomInButton: {
              enabled: false,
            },
            closeButton: {
              enabled: false,
            }
          }}
        />
      );
    },
    viewOnMapHandler
  }), [ viewOnMapHandler, sarsCov2VisualizationInformation, dataPointsForCountryAlphaThreeCodes, countryAlphaThreeCodeToCountryNameMap, modelledSeroprevalenceCustomizationSettings ]);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: sarsCov2ColumnConfiguration })}
      csvFilename="sarscov2tracker_dataset"
      tableHeader={{
        type: TableHeaderType.STANDARD,
        headerText: "Explore SarsCov2 seroprevalence estimates in our database"
      }}
      csvCitationConfiguration={{
        enabled: false
      }}
      additionalButtonConfiguration={{
        enabled: false
      }}
      secondAdditionalButtonConfiguration={{
        enabled: false
      }}
      rowExpansionConfiguration={rowExpansionConfiguration}
      data={state.filteredData.map((element) => ({
        ...element,
        location: generateLocationForDataTable(element),
      }))}
    />
  )
}