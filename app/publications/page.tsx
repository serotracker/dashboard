import React from "react";
import Link from "next/link";
import { MediaMarqueeEntry, mediaMarqueeEntryProps } from "../marquees";
import { Carousel } from "./carousel";

interface Publication {
  id: number;
  text: React.ReactNode;
}

const publications: Publication[] = [{
  id: 1,
  text:
    <div>
      <p className="inline">Toews, E., Shaikh, S., Akter, S., Zhang, C., Selemon, A., Arora, R.K., Bobrovitz, N., Jaenisch, T., Ware, H. and Whelan, M.G., 2025. </p>
      <Link className='inline text-link' href='https://doi.org/10.1101/2025.07.10.25331249' target="__blank" rel="noopener noreferrer">Serological and viral prevalence of Oropouche virus (OROV): A systematic review and meta-analysis from 2000-2024 including human, animal, and vector surveillance studies</Link>
      <p className="inline">. medRxiv, pp.2025-07</p>
    </div>
}, {
  id: 2,
  text:
    <div>
      <p className="inline">Cao C, Arora R, Cento P, Manta K, Farahani E, Cecere M, Selemon A, Sang J, Gong LX, Kloosterman R, Jiang S. </p>
      <Link className='inline text-link' href='https://doi.org/10.1101/2025.06.13.25329541' target="__blank" rel="noopener noreferrer">Automation of Systematic Reviews with Large Language Models</Link>
      <p className="inline">. medRxiv. 2025 Jun 13:2025-06.</p>
    </div>
}, {
  id: 3,
  text:
    <div>
      <p className="inline">Cao C, Sang J, Arora R, Chen D, Kloosterman R, Cecere M, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.7326/ANNALS-24-02189' target="__blank" rel="noopener noreferrer">Development of Prompt Templates for Large Language Model–Driven Screening in Systematic Reviews</Link>
      <p className="inline">. Ann Intern Med. 2025 Mar;178(3):389–401.</p>
    </div>
}, {
  id: 4,
  text:
    <div>
      <p className="inline">Whelan MG, Ware H, Ranka H, Kenny S, Shaikh S, Roell Y, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1016/S1473-3099(24)00585-1' target="__blank" rel="noopener noreferrer">ArboTracker: a multipathogen dashboard and data platform for arbovirus seroprevalence studies</Link>
      <p className="inline">. Lancet Infect Dis. 2024 Nov;24(11):e670–1.</p>
    </div>
}, {
  id: 5,
  text:
    <div>
      <p className="inline">Cheng B, Loeschnik E, Selemon A, Hosseini R, Yuan J, Ware H, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1111/irv.13283' target="__blank" rel="noopener noreferrer">Adherence of SARS‐CoV‐2 Seroepidemiologic Studies to the ROSES‐S Reporting Guideline During the COVID‐19 Pandemic</Link>
      <p className="inline">. Influenza Other Respir Viruses. 2024 Jul;18(7):e13283.</p>
    </div>
}, {
  id: 6,
  text:
    <div>
      <p className="inline">Müller SA, Agweyu A, Akanbi OA, Alex-Wele MA, Alinon KN, Arora RK, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1016/S0140-6736(23)00964-9' target="__blank" rel="noopener noreferrer">Learning from serosurveillance for SARS-CoV-2 to inform pandemic preparedness and response</Link>
      <p className="inline">. The Lancet. 2023 Jul;402(10399):356–8.</p>
    </div>
}, {
  id: 7,
  text:
    <div>
      <p className="inline">Farley E, Okeibunor J, Balde T, Donkor IO, Kleynhans J, Wamala JF, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1111/irv.13170' target="__blank" rel="noopener noreferrer">Short communication—Lessons learnt during the implementation of Unity‐aligned SARS‐CoV‐2 seroprevalence studies in Africa</Link>
      <p className="inline">. Influenza Other Respir Viruses. 2023 Aug;17(8):e13170.</p>
    </div>
}, {
  id: 8,
  text:
    <div>
      <p className="inline">Perlman‐Arrow S, Loo N, Bobrovitz N, Yan T, Arora RK. </p>
      <Link className='inline text-link' href='https://doi.org/10.1002/jrsm.1636' target="__blank" rel="noopener noreferrer">A real‐world evaluation of the implementation of NLP technology in abstract screening of a systematic review</Link>
      <p className="inline">. Res Synth Methods. 2023 Jul;14(4):608–21.</p>
    </div>
}, {
  id: 9,
  text:
    <div>
      <p className="inline">Bobrovitz N, Ware H, Ma X, Li Z, Hosseini R, Cao C, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1016/S1473-3099(22)00801-5' target="__blank" rel="noopener noreferrer">Protective effectiveness of previous SARS-CoV-2 infection and hybrid immunity against the omicron variant and severe disease: a systematic review and meta-regression</Link>
      <p className="inline">. Lancet Infect Dis. 2023 May;23(5):556–67.</p>
    </div>
}, {
  id: 10,
  text:
    <div>
      <p className="inline">Bobrovitz N, Noël K, Li Z, Cao C, Deveaux G, Selemon A, et al. </p>
      <Link className='inline text-link' href='https://www.medrxiv.org/content/10.1101/2021.11.17.21266471v2' target="__blank" rel="noopener noreferrer">SeroTracker-RoB: an approach to automating reproducible risk of bias assessment of seroprevalence studies</Link>
      <p className="inline"> [Internet]. medRxiv; 2022 [cited 2022 Jun 4]. p. 2021.11.17.21266471. </p>
    </div>
}, {
  id: 11,
  text:
    <div>
      <p className="inline">Boucher E, Cao C, D’Mello S, Duarte N, Donnici C, Duarte N, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1136/bmjopen-2022-063771' target="__blank" rel="noopener noreferrer">Occupation and SARS-CoV-2 seroprevalence studies: a systematic review</Link>
      <p className="inline">. BMJ Open. 2023 Feb;13(2):e063771.</p>
    </div>
}, {
  id: 12,
  text:
    <div>
      <p className="inline">Cable J, Fauci A, Dowling WE, Günther S, Bente DA, Yadav PD, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1111/nyas.14898' target="__blank" rel="noopener noreferrer">Lessons from the pandemic: Responding to emerging zoonotic viral diseases—a Keystone Symposia report</Link>
      <p className="inline">. Ann N Y Acad Sci. 2022 Dec;1518(1):209–25.</p>
    </div>
}, {
  id: 13,
  text:
    <div>
      <p className="inline">Donnici C, Ilincic N, Cao C, Zhang C, Deveaux G, Clifton DA, et al. </p>
      <Link className='inline text-link' href='https://www.medrxiv.org/content/10.1101/2022.02.17.22271099v1' target="__blank" rel="noopener noreferrer">Timeliness of reporting of SARS-CoV-2 seroprevalence results and their utility for infectious disease surveillance</Link>
      <p className="inline"> [Internet]. medRxiv; 2022 [cited 2022 Apr 27]. p. 2022.02.17.22271099.</p>
    </div>
}, {
  id: 14,
  text:
    <div>
      <p className="inline">Ma X, Li Z, Whelan MG, Kim D, Cao C, Yanes-Lane M, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.3390/vaccines10122000' target="__blank" rel="noopener noreferrer">Serology Assays Used in SARS-CoV-2 Seroprevalence Surveys Worldwide: A Systematic Review and Meta-Analysis of Assay Features, Testing Algorithms, and Performance</Link>
      <p className="inline">. Vaccines. 2022 Nov 24;10(12):2000.</p>
    </div>
}, {
  id: 15,
  text:
    <div>
      <p className="inline">Lewis HC, Ware H, Whelan M, Subissi L, Li Z, Ma X, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1136/bmjgh-2022-008793' target="__blank" rel="noopener noreferrer">SARS-CoV-2 infection in Africa: a systematic review and meta-analysis of standardised seroprevalence studies, from January 2020 to December 2021</Link>
      <p className="inline">. BMJ Glob Health. 2022 Aug;7(8):e008793.</p>
    </div>
}, {
  id: 16,
  text:
    <div>
      <p className="inline">Bergeri I, Whelan MG, Ware H, Subissi L, Nardone A, Lewis HC, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1371/journal.pmed.1004107' target="__blank" rel="noopener noreferrer">Global SARS-CoV-2 seroprevalence from January 2020 to April 2022: A systematic review and meta-analysis of standardized population-based studies</Link>
      <p className="inline">. Suthar AB, editor. PLOS Med. 2022 Nov 10;19(11):e1004107.</p>
    </div>
}, {
  id: 17,
  text:
    <div>
      <p className="inline">Duarte N, Yanes-Lane M, Arora RK, Bobrovitz N, Liu M, Bego MG, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1093/ofid/ofab632' target="__blank" rel="noopener noreferrer">Adapting Serosurveys for the SARS-CoV-2 Vaccine Era</Link>
      <p className="inline">. Open Forum Infect Dis. 2022 Feb 1;9(2):ofab632.</p>
    </div>
}, {
  id: 18,
  text:
    <div>
      <p className="inline">Van Kerkhove M, Grant R, Subissi L, Valenciano M, Glonti K, Bergeri I, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1111/irv.12870' target="__blank" rel="noopener noreferrer">ROSES-S: Statement from the World Health Organization on the reporting of Seroepidemiologic studies for SARS-CoV-2</Link>
      <p className="inline">. Influenza Other Respir Viruses. 2021 May;In press.</p>
    </div>
}, {
  id: 19,
  text:
    <div>
      <p className="inline">Bobrovitz N, Arora RK, Cao C, Boucher E, Liu M, Rahim H, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1371/journal.pone.0252617' target="__blank" rel="noopener noreferrer">Global seroprevalence of SARS-CoV-2 antibodies: a systematic review and meta-analysis</Link>
      <p className="inline">. PLoS ONE [Internet]. 2021 Jun 23 [cited 2021 Mar 7];16(6).</p>
    </div>
}, {
  id: 20,
  text:
    <div>
      <p className="inline">Arora RK, Joseph A, Van Wyk J, Rocco S, Atmaja A, May E, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1016/S1473-3099(20)30631-9' target="__blank" rel="noopener noreferrer">SeroTracker: a global SARS-CoV-2 seroprevalence dashboard</Link>
      <p className="inline">. Lancet Infect Dis [Internet]. [cited 2020 Nov 11];</p>
    </div>
}, {
  id: 21,
  text:
    <div>
      <p className="inline">Bobrovitz N, Arora RK, Yan T, Rahim H, Duarte N, Boucher E, et al. </p>
      <Link className='inline text-link' href='https://doi.org/10.1101/2020.05.10.20097451' target="__blank" rel="noopener noreferrer">Lessons from a rapid systematic review of early SARS-CoV-2 serosurveys</Link>
      <p className="inline">. medRxiv. 2020 May 14;2020.05.10.20097451.</p>
    </div>
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
