import React from "react";
import Link from "next/link";
import { Sponsor, SponsorBanner } from "./sponsor-banner";

export default function DataExtractionPage() {
  const headerClassname = 'my-8';

  return (
    <>
      <h2 className={"mb-8"}>About SeroTracker</h2>
      <div className="mb-4">
        <p className="inline font-semibold">SeroTracker synthesizes findings from thousands of seroprevalence studies worldwide, providing a data platform and interactive dashboard for pathogen serosurveillance. </p>
        <p className="inline">Confirmed cases are just the tip of the iceberg - they undercount the true number of infections because people may have asymptomatic infections or lack access to diagnostic testing. In contrast, seroprevalence studies measure antibodies against a particular pathogen in the population. Because people with these antibodies have been previously infected or vaccinated, these studies are crucial to understanding the true extent of a pandemic and in measuring population antibody levels.</p>
      </div>
      <SponsorBanner
        className="mb-4"
        sponsors={[
          Sponsor.COVID_19_IMMUNITY_TASK_FORCE,
          Sponsor.CENTRE_FOR_HEALTH_INFORMATICS,
          Sponsor.PUBLIC_HEALTH_AGENCY,
          Sponsor.WORLD_HEALTH_ORGANIZATION,
          Sponsor.AMC_JOULE,
        ]}
      />
      <div className='mb-4'>
        <p className="inline">SeroTracker is supported by the </p>
        <Link className="inline text-link" href="https://www.canada.ca/en/public-health.html" target="__blank" rel="noopener noreferrer">Public Health Agency of Canada</Link>
        <p className="inline"> through the </p>
        <Link className="inline text-link" href="https://www.covid19immunitytaskforce.ca/" target="__blank" rel="noopener noreferrer">COVID-19 Immunity Task Force</Link>
        <p className="inline">. SeroTracker is also hosted at the </p>
        <Link className="inline text-link" href="https://cumming.ucalgary.ca/centres/centre-health-informatics" target="__blank" rel="noopener noreferrer">University of Calgary&apos;s Centre for Health Informatics</Link>
        <p className="inline">.</p>
      </div>
      <div className='mb-4'>
        <p className="inline">SeroTracker is working with the </p>
        <Link className="inline text-link" href="https://www.who.int/" target="__blank" rel="noopener noreferrer">World Health Organization</Link>
        <p className="inline"> to visualize and synthesize results from the </p>
        <Link className="inline text-link" href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/technical-guidance/early-investigations" target="__blank" rel="noopener noreferrer">Unity seroprevalence studies</Link>
        <p className="inline">. SeroTracker and the World Health Organization are grateful for German Federal Ministry of Health (BMG) COVID-19 Research and Development funding to support this effort. </p>
      </div>
      <div className="mb-4">
        <Link className="inline text-link" href="https://www.mapbox.com/" target="__blank" rel="noopener noreferrer">Mapbox </Link>
        <p className='mb-4 inline'>supports SeroTracker&apos;s mapping infrastructure.</p>
      </div>
      {process.env.NEXT_PUBLIC_MERS_TRACKER_ENABLED && <h2 className={headerClassname}>ArboTracker </h2> }
      {!process.env.NEXT_PUBLIC_MERS_TRACKER_ENABLED && <h2 className={headerClassname}>New dashboard: ArboTracker </h2> }
      <div className="mb-4">
        <p className='inline'> ArboTracker data was collected through a systematic review of published arbovirus seroprevalence studies in collaboration with partners at the </p>
        <Link className='inline text-link' href='https://coloradosph.cuanschutz.edu/research-and-practice/centers-programs/globalhealth/research-projects/arbovirus-research-consortium' target="__blank" rel="noopener noreferrer">Arbovirus Research Consortium</Link>
        <p className='inline'> at the Colorado School of Public Health and Heidelberg University Hospital. The search feeding the current dashboard was conducted on March 13, 2023. Data was extracted by researchers at Heidelberg University for each source&apos;s estimate(s) and certain relevant subgroups. Additional relevant data was extracted by researchers at SeroTracker. Full methods are available in </p>
        <Link className='inline text-link' href='https://docs.google.com/document/d/1bdePf81TemPkRqfOKWA4z3-Le0TSbl4BrZ8jTVD5IiE/edit?usp=sharing' target="__blank" rel="noopener noreferrer">our protocol</Link>
        <p className='inline'>.</p>
      </div>
      <div className="mb-4">
        <p className='inline'> We produce data for both academic and public use on our dashboard. In May 2024 we updated our search strategy to capture additional data, which will be added to the dashboard in the coming months. A PROSPERO record with a citation can be found </p>
        <Link className='inline text-link' href='https://www.crd.york.ac.uk/prospero/display_record.php?ID=CRD42024551000' target="__blank" rel="noopener noreferrer">here</Link>
        <p className='inline'>. For further information beyond the following high-level summary, please see our </p>
        <Link className='inline text-link' href='https://docs.google.com/document/d/1bdePf81TemPkRqfOKWA4z3-Le0TSbl4BrZ8jTVD5IiE/edit?usp=sharing' target="__blank" rel="noopener noreferrer">study protocol</Link>
        <p className='inline'> for a detailed explanation of our research processes. </p>
      </div>
      <SponsorBanner
        className="mb-4"
        sponsors={[
          Sponsor.COLORADO_PUBLIC_SCHOOL_OF_HEALTH,
          Sponsor.HEIDELBERG_UNIVERSITY,
          Sponsor.RECODID,
          Sponsor.EUROPEAN_COMMISSION,
          Sponsor.CANADIAN_INSTITUTES_OF_HEALTH_RESEARCH,
        ]}
      />
      <div className="mb-4">
        <p className='inline'> The ArboTracker work for the initial systematic review was supported by the </p>
        <Link className='inline text-link' href='https://recodid.eu/' target="__blank" rel="noopener noreferrer">ReCoDID consortium</Link>
        <p className='inline'> (Reconciliation of Cohort Data for Infectious Diseases). The ReCoDID project has received funding from the European Union&apos;s Horizon 2020 Research and Innovation Programme under Grant Agreement No. 825746 and was supported by the </p>
        <Link className='inline text-link' href='https://cihr-irsc.gc.ca/e/13147.html' target="__blank" rel="noopener noreferrer">Canadian Institutes of Health Research Institute of Genetics</Link>
        <p className='inline'> (CIHR-IG) under Grant Agreement No 01886-000.</p>
      </div>
      {process.env.NEXT_PUBLIC_MERS_TRACKER_ENABLED && <>
        <h2 className={headerClassname}>New dashboard: MERSTracker </h2>
        <div className="mb-4">
          <p className='inline'> MERSTracker data was collected from peer reviewed journal articles in collaboration with the </p>
          <Link className="inline text-link" href="https://www.who.int/" target="__blank" rel="noopener noreferrer">World Health Organization</Link>
          <p className='inline'> and the </p>
          <Link className="inline text-link" href="https://www.fao.org/" target="__blank" rel="noopener noreferrer">Food and Agriculture Organization of the United Nations</Link>
          <p className='inline'>. We don&apos;t assess assay or study quality, please use your judgement when drawing conclusions. Our database is not comprehensive and we continue to add studies to it. You can submit a MERS study that you believe belongs on the dashboard by using </p>
          <Link className="inline text-link underline text-end" target="_blank" rel="noopener noreferrer" href="https://forms.gle/ifwicQVVjj9CeNoA9">this form</Link>
          <p className='inline'> and it will be reviewed by a member of our team.</p>
        </div>
        <div>
          {process.env.NEXT_PUBLIC_FAO_EVENT_DATA_ENABLED === 'true' && (<p className='inline'>Event data and camel population data</p>)}
          {process.env.NEXT_PUBLIC_FAO_EVENT_DATA_ENABLED !== 'true' && (<p className='inline'>Camel population data</p>)}
          <p className='inline'> from the dashboard is supplied entirely by the Food and Agriculture Organization of the United Nation&apos;s </p>
          <Link className="inline text-link" href="https://empres-i.apps.fao.org/" target="__blank" rel="noopener noreferrer">EMPRES-i dashboard</Link>
          <p className='inline'> which collects MERS events as they are reported by national authorities and population data for various different species of livestock.</p>
        </div>
      </>}
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
        <Link className='inline text-link' href='https://forms.gle/pKNiMiMYr6hiKnXx8' target="__blank" rel="noopener noreferrer">this form.</Link>
        <p className='inline'> For SARS-CoV-2 submissions, please use </p>
        <Link className='inline text-link' href='https://docs.google.com/forms/d/e/1FAIpQLSdvNJReektutfMT-5bOTjfnvaY_pMAy8mImpQBAW-3v7_B2Bg/viewform' target="__blank" rel="noopener noreferrer">this form</Link>
        <p className='inline'> - however please see our FAQ for our frequency of data updates for this dataset.</p>
      </div>
    </>
  );
}
