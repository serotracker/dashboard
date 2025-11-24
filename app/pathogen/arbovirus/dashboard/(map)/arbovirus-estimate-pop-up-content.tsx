import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { ArbovirusEstimateType } from "@/gql/graphql";
import { parseISO } from "date-fns";
import React, { useMemo } from "react";
import { cleanGeographicScope, geographicScopeToColourClassnameMap } from "../../utils";

function pathogenFullString(pathogen: string) {
  switch (pathogen) {
    case "DENV":
      return "Dengue Virus";
    case "ZIKV":
      return "Zika Virus";
    case "CHIKV":
      return "Chikungunya Virus";
    case "YFV":
      return "Yellow Fever Virus";
    case "WNV":
      return "West Nile Virus";
    case "MAYV":
      return "Mayaro Virus";
    case "OROV":
      return "Oropouche Virus";
    default:
      return "Unknown";
  }
}

interface ArbovirusEstimatePopupContentProps {
  estimate: ArbovirusEstimate;
}

export const ArbovirusEstimatePopupContent = (props: ArbovirusEstimatePopupContentProps) => {
  const {
    seroprevalence,
    pathogen,
    estimateType,
    geographicScope,
    seroprevalenceStudy95CILower,
    seroprevalenceStudy95CIUpper,
    sampleSize
  } = props.estimate;
  
  const cleanedGeographicScope = useMemo(() => {
    return cleanGeographicScope(geographicScope);
  }, [ geographicScope ]);

  const topBannerText = useMemo(() => {
    const seroprevalenceText = estimateType === ArbovirusEstimateType.Seroprevalence
      ? `Seroprevalence: ${(seroprevalence * 100).toFixed(1)}%`
      : `Viral Prevalence: ${(seroprevalence * 100).toFixed(1)}%`
    const arbovirusText = `(Arbovirus: ${pathogenFullString(pathogen)})`;

    if(!seroprevalenceStudy95CILower || !seroprevalenceStudy95CIUpper) {
      return `${seroprevalenceText} ${arbovirusText}`
    }

    const confidenceIntervalText = `[95% CI ${(seroprevalenceStudy95CILower * 100).toFixed(1)}%-${(seroprevalenceStudy95CIUpper * 100).toFixed(1)}%]`;

    return `${seroprevalenceText} ${confidenceIntervalText} ${arbovirusText}`
  }, [ seroprevalence, seroprevalenceStudy95CILower, seroprevalenceStudy95CIUpper, pathogen, estimateType ])

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.WIDE}
      headerConfiguration={{
        text: `${pathogenFullString(props.estimate.pathogen)} Estimate`,
        textAlignment: HeaderConfigurationTextAlignment.LEFT
      }}
      subtitleConfiguration={props.estimate.sourceSheetName ? {
        enabled: true,
        text: props.estimate.sourceSheetName,
        link: props.estimate.url ?? undefined
      } : {
        enabled: false
      }}
      topBannerConfiguration={{
        enabled: true,
        bannerText: topBannerText,
        bannerColourClassname: `bg-${props.estimate.pathogen.toLowerCase()}`,
        isTextBolded: true,
        isTextCentered: false,
        alternateViewButtonEnabled: false
      }}
      alternateViewConfiguration={{ enabled: false }}
      rows={[{
        title: "Sampling Date Range",
        type: PopUpContentRowType.DATE_RANGE,
        dateRangeStart: props.estimate.sampleStartDate ? parseISO(props.estimate.sampleStartDate) : undefined,
        dateRangeEnd: props.estimate.sampleEndDate ? parseISO(props.estimate.sampleEndDate) : undefined
      }, {
        title: "Inclusion Criteria",
        type: PopUpContentRowType.TEXT,
        text: props.estimate.inclusionCriteria ?? 'Not Reported'
      }, {
        title: "Location",
        type: PopUpContentRowType.LOCATION,
        countryName: props.estimate.country ?? 'Unknown',
        districtName: props.estimate.district ?? undefined,
        stateName: props.estimate.state ?? undefined,
        cityName: props.estimate.city ?? undefined,
      }, {
        title: "Geographic Scope",
        type: PopUpContentRowType.COLOURED_PILL_LIST,
        values: [ cleanedGeographicScope ],
        valueToColourClassnameMap: geographicScopeToColourClassnameMap,
        defaultColourClassname: 'bg-sky-100'
      }, (sampleSize ? {
        title: "Sample Size",
        type: PopUpContentRowType.NUMBER,
        value: sampleSize
      } : {
        title: "Sample Size",
        type: PopUpContentRowType.TEXT,
        text: 'N/A'
      }), (Array.isArray(props.estimate.antibodies) ? {
        title: "Antibody Target",
        type: PopUpContentRowType.COLOURED_PILL_LIST,
        values: props.estimate.antibodies,
        valueToColourClassnameMap: {
          'IgG': 'bg-blue-700 text-white',
          'IgM': 'bg-black text-white',
          'IgAM': 'bg-green-200',
          'NAb': 'bg-yellow-400',
        },
        defaultColourClassname: 'bg-sky-100'
      } : {
        title: "Antibody Target",
        type: PopUpContentRowType.TEXT,
        text: 'N/A'
      }), {
        title: "Antigen",
        type: PopUpContentRowType.TEXT,
        text: props.estimate.antigen ?? 'Not specified'
      }, {
        title: "Assay",
        type: PopUpContentRowType.COLOURED_PILL_LIST,
        values: props.estimate.assay,
        valueToColourClassnameMap: {
          'ELISA': 'bg-amber-200',
          'LFIA': 'bg-teal-200',
          'VNT': 'bg-blue-200',
          'PRNT': 'bg-violet-200',
          'FRNT': 'bg-orange-200',
          'MIA': 'bg-lime-200',
          'Other': 'bg-blue-700 text-white',
          'HAI': 'bg-fuchsia-200',
          'MNT': 'bg-green-200',
          'CF': 'bg-rose-200',
          'RDT': 'bg-purple-200',
          'RT-PCR': 'bg-black text-white',
          'Viral isolation': 'bg-yellow-400',
          'Not Reported': 'bg-zinc-200',
          'No': 'bg-stone-200',
        },
        defaultColourClassname: 'bg-sky-100'
      }]}
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}
