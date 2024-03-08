import Link from "next/link";

export enum FAQPageOptionId {
  WHERE_DOES_SEROTRACKERS_DATA_COME_FROM = 'WHERE_DOES_SEROTRACKERS_DATA_COME_FROM',
  HOW_DOES_SEROTRACKER_COLLECT_THEIR_DATA = 'HOW_DOES_SEROTRACKER_COLLECT_THEIR_DATA',
  HOW_DOES_SEROTRACKER_EXTRACT_DATA = 'HOW_DOES_SEROTRACKER_EXTRACT_DATA',
  HOW_DOES_SEROTRACKERS_DATA_SHOW_UP_ON_THE_MAP = 'HOW_DOES_SEROTRACKERS_DATA_SHOW_UP_ON_THE_MAP',
  CAN_I_DOWNLOAD_SEROTRACKERS_DATA = 'CAN_I_DOWNLOAD_SEROTRACKERS_DATA',
  HOW_HAS_SEROTRACKERS_DATA_BEEN_USED_BY_OTHERS = 'HOW_HAS_SEROTRACKERS_DATA_BEEN_USED_BY_OTHERS'
}

export const faqPageText: Record<FAQPageOptionId, {label: string, content: JSX.Element}> = {
  [FAQPageOptionId.WHERE_DOES_SEROTRACKERS_DATA_COME_FROM]: {
    label: "Where does SeroTracker's data come from?",
    content: <p className='inline'> We collect all seroprevalence data from published peer reviewed research articles, preprints, reports, and media (unpublished grey literature). The source of any individual estimate can be viewed by clicking on the estimate on the map or by referencing the Source column in the table in the dashboard or the url column in a csv downloaded from the table. <Link className="inline text-link underline" target="_blank" href="/pathogen/arbovirus/dashboard#table">This is a link to the ArboTracker map</Link> and <Link className="inline text-link underline" target="_blank" href="/pathogen/arbovirus/dashboard#table">this is a link to the ArboTracker data table</Link>.</p>
  },
  [FAQPageOptionId.HOW_DOES_SEROTRACKER_COLLECT_THEIR_DATA]: {
    label: 'How does SeroTracker collect their data?',
    content: <p className='inline'> We conduct regular searches of several databases including Medline, EMBASE, Web of Science, and Europe PMC and targeted google searches. In addition, anyone can submit arbovirus-related sources for us to screen and include in our review by filling out <Link className="inline text-link underline" target="_blank" href="https://forms.gle/pKNiMiMYr6hiKnXx8">this form</Link>. </p>
  },
  [FAQPageOptionId.HOW_DOES_SEROTRACKER_EXTRACT_DATA]: {
    label: 'How does SeroTracker extract data from their sources?',
    content: <p className="inline"> We have an extensive research team trained in health sciences and epidemiology who manually reviews articles and records seroprevalence estimates into a data management platform called Airtable. </p>
  },
  [FAQPageOptionId.HOW_DOES_SEROTRACKERS_DATA_SHOW_UP_ON_THE_MAP]: {
    label: 'How does SeroTracker’s data show up on the map?',
    content: <p className="inline"> Data inputted into Airtable is automatically run through a software pipeline that cleans it and computes additional information (e.g. a study’s geographic coordinates). The outputs of the pipeline are then stored in a separate database, which is queried by vercel.serotracker.com to serve the map, data tables, and data visualizations. Our data pipeline code is open source and can be found <Link className="inline text-link underline" target="_blank" href="https://github.com/serotracker/iit-backend-v2">here</Link>.</p>
  },
  [FAQPageOptionId.CAN_I_DOWNLOAD_SEROTRACKERS_DATA]: {
    label: "Can I download SeroTracker's data for my own analysis?",
    content: <p className="inline"> Yes, our data is open-source and free for anyone to use. Every data table on the dashboard has a button next to it that allows you to download a csv of the data in the table. <Link className="inline text-link underline" target="_blank" href="/pathogen/arbovirus/dashboard#table">This is a link to the ArboTracker data table</Link> where it is possible to download a csv containing all of our arbovirus seroprevalence estimates. </p>
  },
  [FAQPageOptionId.HOW_HAS_SEROTRACKERS_DATA_BEEN_USED_BY_OTHERS]: {
    label: "How has SeroTracker's data been used by others?",
    content: <p className="inline"> SeroTracker data is used by many public health professionals and health agencies such as the World Health Organization and Public Health Agency of Canada, among others. <Link className="inline text-link underline" target="_blank" href="https://www.medrxiv.org/content/10.1101/2020.11.17.20233460v2">Our most recent publication</Link> analyzes global SARS-CoV-2 seroprevalence from January - December, 2020. </p>
  },
}