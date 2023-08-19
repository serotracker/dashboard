import React from "react";

/**
 * @param title: left column of study modal: title of content
 * @param content: right content of study modal: the actual content for this record
 */
function row(title: string, content: JSX.Element | string | string[] | null | undefined) {
    return (
        <div className={"d-flex justify-content-between mb-2"}>
            <div className={"popup-heading"}>
                {title}
            </div>
            <div className={"popup-text"}>
                {content}
            </div>
        </div>
    )
}

function riskTag(pathogen: string) {
    return(
        <div className={"popup-risk-tag popup-risk-low"}>
            Pathogen: {pathogen}
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

export default function ArboStudyPopup(record: any) {
    return (
        <div className="popup-content pt-2" >
            {/*Header section*/}
            <div className={"popup-section"}>
                <div className="popup-title">
                    Study Number {record.estimate_id}
                </div>
                <div className="popup-subtitle">
                    {record.url ? <a href={record.url} target="_blank" rel="noopener noreferrer"> PLACEHOLDER LINK </a> : "NO URL"}
                </div>
            </div>
            {/*SeroPrev section*/}
            <div className={"popup-seroprev-level popup-section"}>
                <div className={"popup-heading"}>
                    {"Best Seroprevalence estimate"}: <b> {`${record.seroprevalence * 100}%`}</b>
                </div>
                <div className={"popup-text"}>
                    {(record.sample_start_date && record.sample_end_date) && (
                        <>
                            {`${record.sample_start_date} to ${record.sample_end_date}`}
                        </>)
                    }
                </div>
            </div>
            {/*Content section*/}
            <div className={"popup-section"}>
                {row("Inclusion Criteria", record.inclusion_criteria ? record.inclusion_criteria : "Not Reported")}
                {row("Location", getGeography(record.city, record.state, record.country))}
                {row("Sample Size", record.sample_size?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
                {row("Atibody Target",  record.antibody)}
                {row("Antigen", record.antigen)}
                {row("Assay", record.assay)}
            </div>
            {/*RiskTag section*/}
            {riskTag(`${record.pathogen}`)}
        </div>)
}
