import { GenericMapPopUp } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import parseISO from "date-fns/parseISO";
import React, { useMemo } from "react";

function pathogenFullString(pathogen: string) {
  switch (pathogen) {
      case "DENV":
        return "Dengue Virus";
      case "ZIKV":
        return "Zika Virus";
      case "CHIKV":
        return "Chikungunya Virus";
      case "YF":
        return "Yellow Fever";
      case "WNV":
        return "West Nile Virus";
      case "MAYV":
        return "Mayaro Virus";
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
    seroprevalenceStudy95CILower,
    seroprevalenceStudy95CIUpper,
    sampleSize
  } = props.estimate; 

  const topBannerText = useMemo(() => {
    const seroprevalencePercentageText = `Seroprevalence: ${(seroprevalence * 100).toFixed(1)}%`;
    const arbovirusText = `(Arbovirus: ${pathogenFullString(pathogen)})`;

    if(!seroprevalenceStudy95CILower || !seroprevalenceStudy95CIUpper) {
      return `${seroprevalencePercentageText} ${arbovirusText}`
    }

    const confidenceIntervalText = `[95% CI ${(seroprevalenceStudy95CILower * 100).toFixed(1)}%-${(seroprevalenceStudy95CIUpper * 100).toFixed(1)}%]`;

    return `${seroprevalencePercentageText} ${confidenceIntervalText} ${arbovirusText}`
  }, [seroprevalence, seroprevalenceStudy95CILower, seroprevalenceStudy95CIUpper, pathogen])

  return (
    <GenericMapPopUp
      headerConfiguration={{
        text: `${pathogenFullString(props.estimate.pathogen)} Estimate`
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
        isTextCentered: false
      }}
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
        stateName: props.estimate.state ?? undefined,
        cityName: props.estimate.city ?? undefined,
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
        type: PopUpContentRowType.TEXT,
        text: props.estimate.assay ?? 'Not specified'
      }]}
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}
