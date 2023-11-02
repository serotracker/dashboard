import React from "react";
import Translate, { TranslateDate, getLanguageType, translateAntibodyTargets } from '@/utils/translate-util/translate-service';

/**
 * @param title: left column of study modal: title of content
 * @param content: right content of study modal: the actual content for this record
 */
function row(title: string, content: JSX.Element | string | string[] | null | undefined) {
    return (
        <div className={"flex justify-between mb-2"}>
            <div className={"text-md font-semibold"}>
                {title}
            </div>
            <div className={"w-2/3"}>
                {content}
            </div>
        </div>
    )
}

function riskTag(riskLevel: string) {
    const popupColorStyles: {[key: string]: string} = {
        "Low": "bg-[#D4F7F6]",
        "Moderate": "bg-[#FFF8D3]",
        "High": "bg-[#FEDBD7]"
    }
    return(
        <div className={"text-center " + (popupColorStyles[riskLevel] ?? "bg-gray-200")}>
            {Translate("RiskOfBiasOptions", [riskLevel])} {Translate("RiskOfBias")}
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

/**
 * @param popGroupOptions: List of population group options, each option being a dictionary with key = language and value = translated option string
 * @param englishPopGroup: English population group string
 */
function getTranslatedPopulationGroup(popGroupOptions: Record<string, string>[], englishPopGroup: string){
    let result = englishPopGroup;
    const popGroupWithTranslations = popGroupOptions.find(x => x.english === englishPopGroup)
    // TODO: refactor so that popGroupOptions keys directly map to languages on the frontend
    const languageTypeMapping = {
      'en': 'english',
      'fr': 'french',
      'de': 'german'
    }

    if(popGroupWithTranslations){
      const lang = languageTypeMapping[getLanguageType()]
      result = popGroupWithTranslations[lang]
    }
    return result
}

export default function SarsCov2StudyPopup(record: any, popGroupOptions: Record<string, string>[]) {
    console.log(record)
    return (
        <div className="w-[460px] bg-white pt-2" >
            {/*Header section*/}
            <div className={"py-2 px-4"}>
                <div className="text-lg font-bold">
                    {Translate(`${record.estimate_grade}StudyDetails`)}
                </div>
                <div className="text-sm text-blue-600">
                    {record.url ? <a href={record.url} target="_blank" rel="noopener noreferrer">{record.source_name}</a> : record.source_name}
                </div>
            </div>
            {/*SeroPrev section*/}
            <div className={"flex justify-between bg-gray-200 w-full py-2 px-4"}>
                <div className={"w-1/3 font-semibold"}>
                    {Translate("BestSeroprevalenceEstimate")}: <b> {record.serum_pos_prevalence ? `${(record.serum_pos_prevalence * 100).toFixed(1)}%` : "N/A"}</b>
                </div>
                <div className={"w-2/3"}>
                    {(record.sampling_start_date && record.sampling_end_date) && (
                        <>
                            {`${TranslateDate(record.sampling_start_date)} ${Translate("DateRangeTo")} ${TranslateDate(record.sampling_end_date)}`}
                        </>)
                    }
                </div>
            </div>
            {/*Content section*/}
            <div className={"py-2 px-4 max-h-[250px] overflow-auto"}>
                {/* {row(Translate("PopulationGroup"), record.population_group ? getTranslatedPopulationGroup(popGroupOptions, record.population_group) : Translate("NotReported"))} */}
                {row(Translate("Location"), getGeography(record.city, record.state, record.country))}
                {row(Translate("SampleSize"), record.denominator_value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, Translate(",")))}
                {row(Translate("AntibodyTarget"), record.antibody_target && record.antibody_target.length > 0 ? translateAntibodyTargets(record.antibody_target) : "N/A")}
                {row(Translate("PositiveCases"), (record.cases_per_hundred ? record.cases_per_hundred.toFixed(1) + Translate("Per100") : "N/A"))}
                {row(Translate("Vaccinations"), (record.full_vaccinations_per_hundred ? record.full_vaccinations_per_hundred.toFixed(1) + Translate("Per100") : "N/A"))}
            </div>
            {/*RiskTag section*/}
            {riskTag(`${record.overall_risk_of_bias}`)}
        </div>)
}
