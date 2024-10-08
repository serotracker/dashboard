import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/sc2-context"
import { parseISO } from "date-fns";
import { useMemo } from "react";

interface SarsCov2EstimatePopupContentProps {
  estimate: SarsCov2Estimate;
}

const riskOfBiasToColourClassnameMap: Record<string, string | undefined> = {
  Low: "bg-[#D4F7F6]",
  Moderate: "bg-[#FFF8D3]",
  High: "bg-[#FEDBD7]",
};

const scopeToColourClassnameMap: Record<string, string | undefined> = {
  National: "bg-national-study",
  Regional: "bg-regional-study",
  Local: "bg-local-study",
};

export const SarsCov2EstimatePopupContent = (props: SarsCov2EstimatePopupContentProps) => {
  const {
    scope,
    riskOfBias,
    seroprevalence,
    denominatorValue: sampleSize,
    samplingStartDate,
    samplingEndDate,
    countryPositiveCasesPerMillionPeople,
    countryPeopleVaccinatedPerHundred,
    countryPeopleFullyVaccinatedPerHundred,
  } = props.estimate;

  const topBannerText = useMemo(() => {
    const seroprevalencePercentageText = seroprevalence
      ? `Seroprevalence: ${(seroprevalence * 100).toFixed(1)}%`
      : 'Seroprevalence: Unknown'

    return `${seroprevalencePercentageText}`
  }, [ seroprevalence ]);

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.WIDE}
      headerConfiguration={{
        text: scope ? `${scope} Study` : "Study",
        textAlignment: HeaderConfigurationTextAlignment.LEFT
      }}
      subtitleConfiguration={{
        enabled: true,
        text: props.estimate.studyName,
        link: props.estimate.url ?? undefined
      }}
      topBannerConfiguration={{
        enabled: true,
        bannerText: topBannerText,
        bannerColourClassname: scope
          ? scopeToColourClassnameMap[scope] ?? 'bg-gray-200'
          : 'bg-gray-200',
        isTextBolded: true,
        isTextCentered: false,
        alternateViewButtonEnabled: false
      }}
      alternateViewConfiguration={{ enabled: false }}
      rows={[{
        title: "Population Group",
        type: PopUpContentRowType.TEXT,
        text: props.estimate.populationGroup ?? 'N/A'
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
      }), {
        title: "Sampling Date Range",
        type: PopUpContentRowType.DATE_RANGE,
        dateRangeStart: samplingStartDate ? parseISO(samplingStartDate) : undefined,
        dateRangeEnd: samplingEndDate ? parseISO(samplingEndDate) : undefined
      }, (Array.isArray(props.estimate.antibodies) ? {
        title: "Antibody Target",
        type: PopUpContentRowType.COLOURED_PILL_LIST,
        values: props.estimate.antibodies,
        valueToColourClassnameMap: {
          'Envelope protein': 'bg-blue-700 text-white',
          'Membrane protein': 'bg-pink-400',
          'Multiplex': 'bg-green-200',
          'Nucleocapsid (N-protein)': 'bg-yellow-400',
          'Spike': 'bg-purple-700 text-white',
          'Whole-virus antigen': 'bg-orange-300'
        },
        defaultColourClassname: 'bg-sky-100'
      } : {
        title: "Antibody Target",
        type: PopUpContentRowType.TEXT,
        text: 'N/A'
      }), {
        title: "Positive cases",
        type: PopUpContentRowType.TEXT,
        text: countryPositiveCasesPerMillionPeople ? `${(countryPositiveCasesPerMillionPeople / 10000).toFixed(1)} per 100`:  "N/A"
      }, {
        title: "Vaccinations",
        type: PopUpContentRowType.TEXT,
        text: countryPeopleVaccinatedPerHundred ? `${countryPeopleVaccinatedPerHundred.toFixed(1)} per 100`:  "N/A"
      }, {
        title: "Full Vaccinations",
        type: PopUpContentRowType.TEXT,
        text: countryPeopleFullyVaccinatedPerHundred ? `${countryPeopleFullyVaccinatedPerHundred.toFixed(1)} per 100`:  "N/A"
      }]}
      bottomBannerConfiguration={riskOfBias ? {
        enabled: true,
        bannerText: `${riskOfBias} Risk of Bias`,
        bannerColourClassname: riskOfBiasToColourClassnameMap[riskOfBias] ?? 'bg-gray-200',
        isTextBolded: false,
        isTextCentered: true,
        alternateViewButtonEnabled: false
      } : {
        enabled: false
      }}
    />
  );
}