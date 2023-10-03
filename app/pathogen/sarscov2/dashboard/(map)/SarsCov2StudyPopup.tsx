import React from "react";

/**
 * @param title: left column of study modal: title of content
 * @param content: right content of study modal: the actual content for this record
 */
function row(title: string, content: JSX.Element | string | string[] | null | undefined) {
    return (
        <div className={"flex justify-between mb-2"}>
            <div className={"text-bold"}>
                {title}
            </div>
            <div className={"text-light"}>
                {content}
            </div>
        </div>
    )
}

function riskTag(riskOfBias: string) {
    return(
        <div className={"popup-risk-tag popup-risk-low"}>
            {riskOfBias}
        </div>
    )
}

const getGeography = (city: string, state: string, country: string) => {
    if (!country) {
        return "Not Reported";
    }

    function renderOutGeography(geo: string[] | string | null | undefined) {
        if (!geo || geo.length === 0) {
            return ""
        }
        if (typeof geo === "string"){
            return geo.trim() + ", "
        }
        else {
            const geoTrimmed = geo.map((g) => g.trim())
            return geoTrimmed.join(", ") + ", ";
        }
    }

    return "" + renderOutGeography(city) + renderOutGeography(state)  + country
}

export default function SarsCov2StudyPopup(record: any) {

    return (
        <div className="popup-content pt-2" >
            {/*Header section*/}
            <div className={"popup-section"}>
                <div className="popup-title">
                    Study Name {record.study_name}
                </div>
                <div className="popup-subtitle">
                    {record.url ? <a href={record.url} target="_blank" rel="noopener noreferrer"> click me </a> : "NO URL"}
                </div>
            </div>
            {/*SeroPrev section*/}
            <div className={"popup-seroprev-level popup-section"}>
                <div className={"popup-heading"}>
                    {"Best Seroprevalence estimate"}: <b> {`${record.serum_pos_prevalence * 100}%`}</b>
                </div>
                <div className={"popup-text"}>
                    {(record.sampling_start_date && record.sampling_end_date) && (
                        <>
                            {`${record.sampling_start_date} to ${record.sampling_end_date}`}
                        </>)
                    }
                </div>
            </div>
            {/*Content section*/}
            <div className={"popup-section"}>
                {row("Summary", record.summary ? record.inclusion_criteria : "")}
                {row("Location", getGeography(record.city, record.state, record.country))}
                {row("Atibody Target",  record.isotype_igg ? "IgG" : "IgM")}
            </div>
            {/*RiskTag section*/}
            {riskTag(`${record.overall_risk_of_bias}`)}
        </div>)
}
