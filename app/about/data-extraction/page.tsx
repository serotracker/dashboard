"use client";

import Link from "next/link";
import { Sponsors } from "./sponsors";

export default function DataExtractionPage() {
  const headerClassname = 'text-3xl font-bold mt-5 mb-4';

  return (
    <div className="m-4">
      <h2 className={headerClassname}>About SeroTracker</h2>
      <div className="mb-4">
        <b className="inline">SeroTracker synthesizes findings from thousands of seroprevalence studies worldwide, providing a data platform and interactive dashboard for pathogen serosurveillance. </b>
        <p className="inline">Confirmed cases are just the tip of the iceberg - they undercount the true number of infections because people may have asymptomatic infections or lack access to diagnostic testing. In contrast, seroprevalence studies measure antibodies against a particular pathogen in the population. Because people with these antibodies have been previously infected or vaccinated, these studies are crucial to understanding the true extent of a pandemic and in measuring population antibody levels.</p>
      </div>
      <Sponsors className="mb-4" />
      <div className='mb-4'>
        <p className="inline">SeroTracker is supported by the </p>
        <Link className="inline text-link" href="https://www.canada.ca/en/public-health.html" target="__blank" rel="noopener noreferrer">Public Health Agency of Canada </Link>
        <p className="inline">through the </p>
        <Link className="inline text-link" href="https://www.covid19immunitytaskforce.ca/" target="__blank" rel="noopener noreferrer">COVID-19 Immunity Task Force</Link>
        <p className="inline">. SeroTracker is also hosted at the </p>
        <Link className="inline text-link" href="https://cumming.ucalgary.ca/centres/centre-health-informatics" target="__blank" rel="noopener noreferrer">University of Calgary&apos;s Centre for Health Informatics</Link>
        <p className="inline">.</p>
      </div>
      <div className='mb-4'>
        <p className="inline">SeroTracker is working with the </p>
        <Link className="inline text-link" href="https://www.who.int/" target="__blank" rel="noopener noreferrer">World Health Organization </Link>
        <p className="inline">to visualize and synthesize results from the </p>
        <Link className="inline text-link" href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/technical-guidance/early-investigations" target="__blank" rel="noopener noreferrer">Unity seroprevalence studies</Link>
        <p className="inline">. SeroTracker and the World Health Organization are grateful for German Federal Ministry of Health (BMG) COVID-19 Research and Development funding to support this effort. </p>
      </div>
      <div className="mb-4">
        <Link className="inline text-link" href="https://www.mapbox.com/" target="__blank" rel="noopener noreferrer">Mapbox </Link>
        <p className='mb-4 inline'>supports SeroTracker&apos;s mapping infrastructure.</p>
      </div>
      <h2 className={headerClassname}>Contact Us</h2>
      <div className="mb-4">
        <p className="inline">For all SeroTracker inquiries (including to support our efforts, collaborate with us, or if you are a journalist interested in reporting on our findings), please contact Mairéad Whelan at </p>
        <Link className="inline text-link" href="mailto:mairead.whelan@ucalgary.ca">mairead.whelan@ucalgary.ca</Link>
        <p className='inline'>, Harriet Ware at </p>
        <Link className="inline text-link" href="mailto:ware.harriet@gmail.com">ware.harriet@gmail.com</Link>
        <p className='inline'>, and Niklas Bobrovitz at </p>
        <Link className="inline text-link" href="mailto:niklas.bobrovitz@mail.utoronto.ca">niklas.bobrovitz@mail.utoronto.ca</Link>
        <p className='inline'>.</p>
      </div>
      <div className="mb-4">
        <p className='inline'>To make us aware of new arbovirus seroprevalence studies or arbovirus studies that we have not yet captured, please fill out </p>
        <Link className='inline text-link' href='https://forms.gle/pKNiMiMYr6hiKnXx8'>this form.</Link>
      </div>
    </div>
  );
}
