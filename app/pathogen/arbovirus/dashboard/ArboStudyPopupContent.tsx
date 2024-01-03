import { TranslateDate } from "@/utils/translate-util/translate-service";
import React, { useMemo } from "react";
import { MapRef, Popup, useMap } from "react-map-gl";

/**
 * @param title: left column of study modal: title of content
 * @param content: right content of study modal: the actual content for this record
 */
function row(
  title: string,
  content: JSX.Element | string | string[] | null | undefined
) {
  return (
    <div className={"flex justify-between mb-2"}>
      <div className={"text-md font-semibold"}>{title}</div>
      <div className={"w-2/3"}>{content}</div>
    </div>
  );
}

function pathogenTag(pathogen: string) {
  return (
    <div className={"text-center w-full bg-gray-200"}>Arbovirus: {pathogen}</div>
  );
}

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

function getAntiBodyColor(antibody: string) {
  switch (antibody) {
    case "IgG": 
      return "bg-blue-700 text-white"
    case "IgM": 
        return "bg-black text-white"
    case "IgAM": 
      return "bg-green-200"
    case "NAb": 
      return "bg-yellow-400"
    default:
      return "bg-sky-100"
  }
}

const getGeography = (city: string, state: string, country: string) => {
  if (!country) {
    return "Not Reported";
  }

  function renderOutGeography(geo: string[] | string | null | undefined) {
    if (!geo || geo.length === 0) {
      return "";
    }
    if (typeof geo === "string") {
      return geo.trim() + ", ";
    } else {
      const geoTrimmed = geo.map((g) => g.trim());
      return geoTrimmed.join(", ") + ", ";
    }
  }

  return "" + renderOutGeography(city) + renderOutGeography(state) + country;
};

interface ArboStudyPopupContentProps {
  record: any;
}

export function ArboStudyPopupContent({ record }: ArboStudyPopupContentProps) {
  const antibodiesArray = Array.isArray(record.antibodies) ? record.antibodies : [];

  return (
    <div className="w-[460px] bg-white pt-2">
      {/*Header section*/}
      <div className={"py-2 px-4"}>
        <div className="text-lg font-bold">
          {`${pathogenFullString(record.pathogen)} Estimate`}
        </div>
        <div className={"text-sm text-blue-600"}>
          {record.url ? <a href={record.url} target="_blank" rel="noopener noreferrer"> 
            {record.sourceSheetName ? record.sourceSheetName : record.url} 
          </a> : "NO URL"}
        </div>
      </div>
      {/*SeroPrev section*/}
      <div className={`flex justify-between bg-${record.pathogen.toLowerCase()} w-full py-2 px-4`}>
        <div className={"font-semibold"}>
          {"Seroprevalence"}: <b> {`${(record.seroprevalence * 100).toFixed(1)}% (Arbovirus: ${pathogenFullString(record.pathogen)})`}</b>
        </div>
      </div>
      {/*Content section*/}
      <div className={"py-2 px-4 max-h-[250px] overflow-auto"}>
        {row(
        "Sampling Date Range", 
        `${TranslateDate(record.sampleStartDate)} to ${TranslateDate(record.sampleEndDate)}`
        )}
        {row(
          "Inclusion Criteria",
          record.inclusionCriteria ? record.inclusionCriteria : "Not Reported"
        )}
        {row(
          "Location",
          getGeography(record.city, record.state, record.country)
        )}
        {row(
          "Sample Size",
          record.sampleSize?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        )}
        <div className={"flex justify-between mb-2"}>
          <div className={"text-md font-semibold"}>
            Antibody Target
          </div>
          <div className={"w-2/3"}>
            {antibodiesArray.map((antibody: any, index: number) => (
          <span key={index} className={`${getAntiBodyColor(antibody)} mr-1 p-2 rounded-sm`}>
            {antibody}
          </span>
          ))}
          </div>
        </div>
        {row("Antigen", record.antigen)}
        {row("Assay", record.assay)}
      </div>
    </div>
  );
}
