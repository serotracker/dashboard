import { SuggestedArboTrackerCitation } from "@/app/pathogen/arbovirus/arbotracker-citations";
import Link from "next/link";

export enum FAQPageOptionId {
  HOW_DOES_SEROTRACKER_COLLECT_THEIR_DATA = 'HOW_DOES_SEROTRACKER_COLLECT_THEIR_DATA',
  HOW_OFTEN_IS_SEROTRACKER_DATA_UPDATED = 'HOW_OFTEN_IS_SEROTRACKER_DATA_UPDATED',
  CAN_I_PARTNER_WITH_SEROTRACKER = 'CAN_I_PARTNER_WITH_SEROTRACKER',
  WHERE_DOES_ARBOTRACKER_DATA_COME_FROM = 'WHERE_DOES_ARBOTRACKER_DATA_COME_FROM',
  HOW_IS_THE_DATA_EXTRACTED_FROM_THE_SOURCES = 'HOW_IS_THE_DATA_EXTRACTED_FROM_THE_SOURCES',
  HOW_OFTEN_IS_ARBOTRACKER_DATA_UPDATED = 'HOW_OFTEN_IS_ARBOTRACKER_DATA_UPDATED',
  HOW_DOES_ARBOTRACKER_DATA_SHOW_UP_ON_THE_MAP = 'HOW_DOES_ARBOTRACKER_DATA_SHOW_UP_ON_THE_MAP',
  CAN_I_DOWNLOAD_ARBOTRACKER_DATA_FOR_MY_OWN_ANALYSIS = 'CAN_I_DOWNLOAD_ARBOTRACKER_DATA_FOR_MY_OWN_ANALYSIS',
  WHERE_DOES_MERSTRACKER_DATA_COME_FROM = 'WHERE_DOES_MERSTRACKER_DATA_COME_FROM',
  HOW_IS_MERSTRACKER_DATA_EXTRACTED_FROM_SOURCES = 'HOW_IS_MERSTRACKER_DATA_EXTRACTED_FROM_SOURCES',
  HOW_DOES_MERSTRACKER_DATA_SHOW_UP_ON_THE_MAP = 'HOW_DOES_MERSTRACKER_DATA_SHOW_UP_ON_THE_MAP',
  CAN_I_DOWNLOAD_MERSTRACKER_DATA_FOR_MY_OWN_ANALYSIS = 'CAN_I_DOWNLOAD_MERSTRACKER_DATA_FOR_MY_OWN_ANALYSIS'
}

export const faqPageText: Record<FAQPageOptionId, {label: string, content: JSX.Element}> = {
  [FAQPageOptionId.HOW_DOES_SEROTRACKER_COLLECT_THEIR_DATA]: {
    label: 'How does SeroTracker collect their data?',
    content: <p className='inline'> We conduct ad-hoc searches of several databases including Medline, EMBASE, Web of Science, and Europe PMC and targeted google searches. In addition, anyone can submit studies for us to screen and include in our review by filling out <Link className="inline text-link underline" target="_blank" rel="noopener noreferrer" href="https://docs.google.com/forms/d/e/1FAIpQLSdvNJReektutfMT-5bOTjfnvaY_pMAy8mImpQBAW-3v7_B2Bg/viewform">this form</Link>. </p>
  },
  [FAQPageOptionId.HOW_OFTEN_IS_SEROTRACKER_DATA_UPDATED]: {
    label: 'How often is SeroTracker data updated?',
    content: <p className='inline'> SeroTracker data was last updated in late 2023. Going forward, our team will scan new literature on an ad-hoc basis and add data.</p>
  },
  [FAQPageOptionId.CAN_I_PARTNER_WITH_SEROTRACKER]: {
    label: 'Can I partner with SeroTracker to build my own dashboard or connect features to an existing dashboard?',
    content: (
      <>
        <p className='inline'> Yes, the SeroTracker approach and our streamlined pipeline can be adapted to make research data useful across health-related topics. Please contact Mairéad Whelan at </p>
        <Link className="inline text-link" href="mailto:mairead.whelan@ucalgary.ca">mairead.whelan@ucalgary.ca</Link>
        <p className='inline'> and Harriet Ware at </p>
        <Link className="inline text-link" href="mailto:ware.harriet@gmail.com">ware.harriet@gmail.com</Link>
        <p className='inline'> to learn more about partnership options.</p>
      </>
    )
  },
  [FAQPageOptionId.WHERE_DOES_ARBOTRACKER_DATA_COME_FROM]: {
    label: 'Where does ArboTracker data come from?',
    content:(
      <>
        <p className='inline'> We conducted a search for published articles on March 13, 2023 of several databases including Web of Science, Google Scholar, LILACS, and PubMed. Our search strategy was updated for a second search to include MEDLINE and EMBASE databases in May 2024. A PROSPERO search record for our May 2024 search with a citation can be found </p>
        <Link className="inline text-link underline" target="_blank" rel="noopener noreferrer" href='https://www.crd.york.ac.uk/prospero/display_record.php?ID=CRD42024551000'>here</Link>
        <p className='inline'>. In addition, anyone can submit sources for us to screen and include in our review by filling out </p>
        <Link className="inline text-link underline" target="_blank" rel="noopener noreferrer" href='https://forms.gle/pKNiMiMYr6hiKnXx8'>this form</Link>
        <p className="inline">.</p>
      </>
    )
  },
  [FAQPageOptionId.HOW_IS_THE_DATA_EXTRACTED_FROM_THE_SOURCES]: {
    label: 'How is the data extracted from sources?',
    content: <p className='inline'> We have an extensive research team trained in health sciences and epidemiology who manually reviews articles and records seroprevalence estimates into a data management platform called Airtable.</p>
  },
  [FAQPageOptionId.HOW_OFTEN_IS_ARBOTRACKER_DATA_UPDATED]: {
    label: 'How often is ArboTracker data updated?',
    content: (
      <>
        <p className='inline'> The search feeding the current dashboard was conducted on March 13, 2023. In May 2024 our search strategy was updated to capture additional data, which will be added to the dashboard in the coming months. The PROSPERO record for the May 2024 search and a citation can be found </p>
        <Link className="inline text-link underline" target="_blank" rel="noopener noreferrer" href='https://www.crd.york.ac.uk/prospero/display_record.php?ID=CRD42024551000'>here</Link>
        <p className='inline'>.</p>
      </>
    )
  },
  [FAQPageOptionId.HOW_DOES_ARBOTRACKER_DATA_SHOW_UP_ON_THE_MAP]: {
    label: 'How does ArboTracker data show up on the map?',
    content: <p className='inline'> Data inputted into Airtable is automatically run through a software pipeline that cleans it and computes additional information (e.g. a study’s geographic coordinates). The outputs of the pipeline are then stored in a separate database, which is queried by <Link className="inline text-link underline" target="_blank" rel="noopener noreferrer" href="https://new.serotracker.com/">new.serotracker.com</Link> to serve the map, data tables, and data visualizations. Our data pipeline code is open source and can be found <Link className="inline text-link underline" target="_blank" rel="noopener noreferrer" href="https://github.com/serotracker/iit-backend-v2">here</Link>. </p>
  },
  [FAQPageOptionId.CAN_I_DOWNLOAD_ARBOTRACKER_DATA_FOR_MY_OWN_ANALYSIS]: {
    label: 'Can I download ArboTracker data for my own analysis?',
    content: (
      <>
        <p className='inline'> Yes, our data is open-source and free for anyone to use. Every data table on the dashboard has a button next to it that allows you to download a csv of the data in the table. </p>
        <Link className="inline text-link underline" target="_blank" rel="noopener noreferrer" href="https://new.serotracker.com/pathogen/arbovirus/dashboard#TABLE">This is a link to the ArboTracker data table where it is possible to download a csv containing all of our arbovirus seroprevalence estimates</Link>
        <p className='inline'>. This is the recommended citation for our data: </p>
        <SuggestedArboTrackerCitation />
        <p className='inline'>.</p>
      </>
    )
  },
  [FAQPageOptionId.WHERE_DOES_MERSTRACKER_DATA_COME_FROM]: {
    label: 'Where does MERSTracker data come from?',
    content:(
      <>
        <p className='inline'> MERSTracker data was collected from peer reviewed journal articles in collaboration with the </p>
        <Link className="inline text-link" href="https://www.who.int/" target="__blank" rel="noopener noreferrer">World Health Organization</Link>
        <p className='inline'> and the </p>
        <Link className="inline text-link" href="https://www.fao.org/" target="__blank" rel="noopener noreferrer">Food and Agriculture Organization of the United Nations</Link>
        <p className='inline'>. </p>
        <p className='inline'>Unpublished camel population map based on a FAO elaboration from the Global Livestock Impact Mapping System (GLIMS) database and adjusted to FAOSTAT 2020. Country boundaries based on </p>
        <p className="inline font-bold">UN Geospatial</p>
        <p className='inline'>. 2023. Map of the World. In: </p>
        <p className='inline italic'>United Nations</p>
        <p className='inline'>. [Cited: November 2024].</p>
        <Link className="inline text-link" href="www.un.org/geospatial/content/map-world-1" target="__blank" rel="noopener noreferrer">www.un.org/geospatial/content/map-world-1</Link>
      </>
    )
  },
  [FAQPageOptionId.HOW_IS_MERSTRACKER_DATA_EXTRACTED_FROM_SOURCES]: {
    label: 'How is the data extracted from the sources?',
    content: <p className='inline'> We have an extensive research team trained in health sciences and epidemiology who manually reviews articles and records seroprevalence estimates into a data management platform called Airtable.</p>
  },
  [FAQPageOptionId.HOW_DOES_MERSTRACKER_DATA_SHOW_UP_ON_THE_MAP]: {
    label: 'How does MERSTracker data show up on the map?',
    content: <p className='inline'> Data inputted into Airtable is automatically run through a software pipeline that cleans it and computes additional information (e.g. a study’s geographic coordinates). The outputs of the pipeline are then stored in a separate database, which is queried by <Link className="inline text-link underline" target="_blank" rel="noopener noreferrer" href="https://new.serotracker.com/">new.serotracker.com</Link> to serve the map, data tables, and data visualizations. Our data pipeline code is open source and can be found <Link className="inline text-link underline" target="_blank" rel="noopener noreferrer" href="https://github.com/serotracker/iit-backend-v2">here</Link>. </p>
  },
  [FAQPageOptionId.CAN_I_DOWNLOAD_MERSTRACKER_DATA_FOR_MY_OWN_ANALYSIS]: {
    label: 'Can I download MERSTracker data for my own analysis?',
    content: (
      <>
        <p className='inline'> Yes, our data is open-source and free for anyone to use. Every data table on the dashboard has a button next to it that allows you to download a csv of the data in the table. </p>
        <Link className="inline text-link underline" target="_blank" rel="noopener noreferrer" href="https://new.serotracker.com/pathogen/mers/dashboard#TABLE">This is a link to the MERSTracker data table where it is possible to download several csv files which contain all of our MERS seroprevalence estimates</Link>
        <p className='inline'>. Our data dictionary, which describes the fields found in the csv file can be found </p>
        <Link className="inline text-link" href="https://airtable.com/app3ebPi0gt39r3xI/shrWqXLuWPhnic2xw" target="__blank" rel="noopener noreferrer">here</Link>
        <p className='inline'>.</p>
      </>
    )
  },
}