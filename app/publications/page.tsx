import React from "react";
import Link from "next/link";
import { MediaMarqueeEntry, mediaMarqueeEntryProps } from "../media-marquee";
import { Carousel } from "./carousel";

interface Publication {
  text: React.ReactNode;
}

const publications = [{
  id: 1,
  text: <p>Toews, E., Shaikh, S., Akter, S., Zhang, C., Selemon, A., Arora, R.K., Bobrovitz, N., Jaenisch, T., Ware, H. and Whelan, M.G., 2025. Serological and viral prevalence of Oropouche virus (OROV): A systematic review and meta-analysis from 2000-2024 including human, animal, and vector surveillance studies. medRxiv, pp.2025-07.</p>
}, {
  id: 2,
  text: <p>Cao C, Arora R, Cento P, Manta K, Farahani E, Cecere M, Selemon A, Sang J, Gong LX, Kloosterman R, Jiang S. Automation of Systematic Reviews with Large Language Models. medRxiv. 2025 Jun 13:2025-06.</p>
}, {
  id: 3,
  text: <p>Cao C, Sang J, Arora R, Chen D, Kloosterman R, Cecere M, et al. Development of Prompt Templates for Large Language Model–Driven Screening in Systematic Reviews. Ann Intern Med. 2025 Mar;178(3):389–401.</p>
}, {
  id: 4,
  text: <p>Whelan MG, Ware H, Ranka H, Kenny S, Shaikh S, Roell Y, et al. ArboTracker: a multipathogen dashboard and data platform for arbovirus seroprevalence studies. Lancet Infect Dis. 2024 Nov;24(11):e670–1.</p>
}, {
  id: 5,
  text: <p>Cheng B, Loeschnik E, Selemon A, Hosseini R, Yuan J, Ware H, et al. Adherence of SARS‐CoV‐2 Seroepidemiologic Studies to the ROSES‐S Reporting Guideline During the COVID‐19 Pandemic. Influenza Other Respir Viruses. 2024 Jul;18(7):e13283.</p>
}, {
  id: 6,
  text: <p>Müller SA, Agweyu A, Akanbi OA, Alex-Wele MA, Alinon KN, Arora RK, et al. Learning from serosurveillance for SARS-CoV-2 to inform pandemic preparedness and response. The Lancet. 2023 Jul;402(10399):356–8.</p>
}, {
  id: 7,
  text: <p>Farley E, Okeibunor J, Balde T, Donkor IO, Kleynhans J, Wamala JF, et al. Short communication—Lessons learnt during the implementation of Unity‐aligned SARS‐CoV‐2 seroprevalence studies in Africa. Influenza Other Respir Viruses. 2023 Aug;17(8):e13170.</p>
}, {
  id: 8,
  text: <p>Perlman‐Arrow S, Loo N, Bobrovitz N, Yan T, Arora RK. A real‐world evaluation of the implementation of NLP technology in abstract screening of a systematic review. Res Synth Methods. 2023 Jul;14(4):608–21.</p>
}, {
  id: 9,
  text: <p>Bobrovitz N, Ware H, Ma X, Li Z, Hosseini R, Cao C, et al. Protective effectiveness of previous SARS-CoV-2 infection and hybrid immunity against the omicron variant and severe disease: a systematic review and meta-regression. Lancet Infect Dis. 2023 May;23(5):556–67.</p>
}, {
  id: 10,
  text: 
    <div>
      <p className="inline">Bobrovitz N, Noël K, Li Z, Cao C, Deveaux G, Selemon A, et al. SeroTracker-RoB: an approach to automating reproducible risk of bias assessment of seroprevalence studies [Internet]. medRxiv; 2022 [cited 2022 Jun 5]. p. 2021.11.17.21266471. Available from: </p>
      <Link className='inline text-link' href='https://www.medrxiv.org/content/10.1101/2021.11.17.21266471v2' target="__blank" rel="noopener noreferrer">https://www.medrxiv.org/content/10.1101/2021.11.17.21266471v2</Link>
    </div>
}, {
  id: 11,
  text: <p>Boucher E, Cao C, D’Mello S, Duarte N, Donnici C, Duarte N, et al. Occupation and SARS-CoV-2 seroprevalence studies: a systematic review. BMJ Open. 2023 Feb;13(2):e063771.</p>
}, {
  id: 12,
  text: <p>Cable J, Fauci A, Dowling WE, Günther S, Bente DA, Yadav PD, et al. Lessons from the pandemic: Responding to emerging zoonotic viral diseases—a Keystone Symposia report. Ann N Y Acad Sci. 2022 Dec;1518(1):209–25.</p>
}, {
  id: 13,
  text:
    <div>
      <p className="inline">Donnici C, Ilincic N, Cao C, Zhang C, Deveaux G, Clifton DA, et al. Timeliness of reporting of SARS-CoV-2 seroprevalence results and their utility for infectious disease surveillance [Internet]. medRxiv; 2022 [cited 2022 Apr 27]. p. 2022.02.17.22271099. Available from: </p>
      <Link className='inline text-link' href='https://www.medrxiv.org/content/10.1101/2022.02.17.22271099v1' target="__blank" rel="noopener noreferrer">https://www.medrxiv.org/content/10.1101/2022.02.17.22271099v1</Link>
    </div>
}, {
  id: 14,
  text: <p>Ma X, Li Z, Whelan MG, Kim D, Cao C, Yanes-Lane M, et al. Serology Assays Used in SARS-CoV-2 Seroprevalence Surveys Worldwide: A Systematic Review and Meta-Analysis of Assay Features, Testing Algorithms, and Performance. Vaccines. 2022 Nov 24;10(12):2000.</p>
}, {
  id: 15,
  text: <p>Lewis HC, Ware H, Whelan M, Subissi L, Li Z, Ma X, et al. SARS-CoV-2 infection in Africa: a systematic review and meta-analysis of standardised seroprevalence studies, from January 2020 to December 2021. BMJ Glob Health. 2022 Aug;7(8):e008793.</p>
}, {
  id: 16,
  text: <p>Bergeri I, Whelan MG, Ware H, Subissi L, Nardone A, Lewis HC, et al. Global SARS-CoV-2 seroprevalence from January 2020 to April 2022: A systematic review and meta-analysis of standardized population-based studies. Suthar AB, editor. PLOS Med. 2022 Nov 10;19(11):e1004107.</p>
}, {
  id: 17,
  text: <p>Duarte N, Yanes-Lane M, Arora RK, Bobrovitz N, Liu M, Bego MG, et al. Adapting Serosurveys for the SARS-CoV-2 Vaccine Era. Open Forum Infect Dis. 2022 Feb 1;9(2):ofab632.</p>
}, {
  id: 18,
  text: <p>Van Kerkhove M, Grant R, Subissi L, Valenciano M, Glonti K, Bergeri I, et al. ROSES-S: Statement from the World Health Organization on the reporting of Seroepidemiologic studies for SARS-CoV-2. Influenza Other Respir Viruses. 2021 May;In press.</p>
}, {
  id: 19,
  text:
    <div>
      <p className="inline">Bobrovitz N, Arora RK, Cao C, Boucher E, Liu M, Rahim H, et al. Global seroprevalence of SARS-CoV-2 antibodies: a systematic review and meta-analysis. PLoS ONE [Internet]. 2021 Jun 23 [cited 2021 Mar 7];16(6). Available from: </p>
      <Link className='inline text-link' href='https://doi.org/10.1371/journal.pone.0252617' target="__blank" rel="noopener noreferrer">https://doi.org/10.1371/journal.pone.0252617</Link>
    </div>
}, {
  id: 20,
  text:
    <div>
      <p className="inline">Arora RK, Joseph A, Van Wyk J, Rocco S, Atmaja A, May E, et al. SeroTracker: a global SARS-CoV-2 seroprevalence dashboard. Lancet Infect Dis [Internet]. [cited 2020 Nov 11]; Available from: </p>
      <Link className='inline text-link' href='https://doi.org/10.1016/S1473-3099(20)30631-9' target="__blank" rel="noopener noreferrer">https://doi.org/10.1016/S1473-3099(20)30631-9</Link>
    </div>
}, {
  id: 21,
  text: <p>Bobrovitz N, Arora RK, Yan T, Rahim H, Duarte N, Boucher E, et al. Lessons from a rapid systematic review of early SARS-CoV-2 serosurveys. medRxiv. 2020 May 14;2020.05.10.20097451.</p>
}]

export default async function PublicationsPage() {
  return (
    <div className="h-full-screen overflow-auto pl-10 pr-10 pt-4 pb-4">
      <div>
        <h2 className="mb-2">Worldwide Media Publications Featuring SeroTracker</h2>
        <Carousel>
          {mediaMarqueeEntryProps.map((props) => (
            <div key={props.link} className="!flex justify-center">
              <MediaMarqueeEntry className='bg-white mb-2 ml-1 mr-1' key={props.link} {...props} />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="mt-3">
        <h2 className="mb-2">Academic Publications From The SeroTracker Team</h2>
        <p className="mb-2">From most recent to least recent (1-{publications.length})</p>
        <ol className="list-decimal ml-9">
          {publications.map((element) => (
            <li key={element.id} className="mb-3">
              {element.text}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
