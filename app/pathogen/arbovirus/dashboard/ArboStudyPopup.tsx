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
    <div className={"text-center w-full bg-gray-200"}>Pathogen: {pathogen}</div>
  );
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

export function ArboStudyPopupContext({ record }: ArboStudyPopupContentProps) {
  return (
    <div className="w-[460px] bg-white pt-2">
      {/*Header section*/}
      <div className={"py-2 px-4"}>
        <div className="text-lg font-bold">
          {`${record.pathogen} Estimate Study`}
        </div>
        <div className={"text-sm text-blue-600"}>
          {record.url ? (
            <a href={record.url} target="_blank" rel="noopener noreferrer">
              {" "}
              {record.url}{" "}
            </a>
          ) : (
            "NO URL"
          )}
        </div>
      </div>
      {/*SeroPrev section*/}
      <div className={"flex justify-between bg-gray-200 w-full py-2 px-4"}>
        <div className={"w-1/3 font-semibold"}>
          {"Seroprevalence"}:{" "}
          <b> {`${(record.seroprevalence * 100).toFixed(1)}%`}</b>
        </div>
        <div className={"w-2/3"}>
          {record.sample_start_date && record.sample_end_date && (
            <>
              {`${TranslateDate(record.sample_start_date)} to ${TranslateDate(
                record.sample_end_date
              )}`}
            </>
          )}
        </div>
      </div>
      {/*Content section*/}
      <div className={"py-2 px-4 max-h-[250px] overflow-auto"}>
        {row(
          "Inclusion Criteria",
          record.inclusion_criteria ? record.inclusion_criteria : "Not Reported"
        )}
        {row(
          "Location",
          getGeography(record.city, record.state, record.country)
        )}
        {row(
          "Sample Size",
          record.sample_size?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        )}
        {row("Antibody Target", record.antibodies.join(", "))}
        {row("Antigen", record.antigen)}
        {row("Assay", record.assay)}
        {row("LngLat", record.longitude + " " + record.latitude)}
      </div>
      {/*RiskTag section*/}
      {pathogenTag(`${record.pathogen}`)}
    </div>
  );
}

export function ArboStudyPopup({ record }: ArboStudyPopupContentProps) {
  const { arboMap } = useMap();
  const getMapboxLatitudeOffset = (map: MapRef) => {
    // Map seems to zoom in in powers of 2, so reducing offset by powers of 2 keeps the modal apprximately
    // in the same center everytime
    // offset needs to reduce exponentially with zoom -- higher zoom x smaller offset
    let mapZoom = map.getZoom();

    return 80 / Math.pow(2, mapZoom);
  };

  console.log('record', record);

  const generatePopup = (record: any) => {
    return (
      <Popup
        key={record.id}
        closeOnClick={false}
        maxWidth="480px"
        anchor="top"
        latitude={record.longitude ?? 0}
        longitude={record.latitude ?? 0}
        onOpen={() => {
          arboMap?.flyTo({
            center: {
              lat: (record.longitude ?? 0) - getMapboxLatitudeOffset(arboMap),
              lon: (record.latitude ?? 0),
            },
            speed: 0.5,
            curve: 0.5,
          });
        }}
      >
        <ArboStudyPopupContext record={record} />
      </Popup>
    );
  };

  return (
    <>
      {generatePopup(record)}
    </>
  );
}
