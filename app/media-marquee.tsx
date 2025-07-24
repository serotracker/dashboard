import Marquee from "react-fast-marquee";
import TheEconomistLogo from "../public/The_Economist_Logo.png";
import NewYorkTimesLogo from "../public/New_York_Times_logo_variation.jpg";
import BloombergLogo from "../public/New_Bloomberg_Logo.png";
import ReutersLogo from "../public/Reuters_Logo.png";
import SanFranciscoChronicleLogo from "../public/San_Francisco_Chronicle_logo.png";
import UsNewsLogo from "../public/U.S._News_&_World_Report_logo.png";
import JournalDeQuebecLogo from "../public/JournalQuebec_Logo2013.png";
import CisionLtdLogo from "../public/Cision_Ltd_logo.png";
import McKinseyLogo from "../public/McKinsey_Script_Mark_2019.png";
import CanadianMedicalAssociationLogo from "../public/Canadian_Medical_Association_logo.png";
import TazLogo from "../public/Taz_Logo.png";
import UniversityOfCalgaryLogo from "../public/University-Of-Calgary-Logo.png";
import HIMSSLogo from "../public/HIMSSlogo_Hfullcolor_RGB.png";
import ForbesLogo from "../public/Forbes_logo.png";
import OxfordUniversityLogo from "../public/University_of_Oxford_Logo.png";
import NewScientistLogo from "../public/New_Scientist_logo.png";
import MarsLogo from "../public/MaRS_Logo_RGB_SMALL.png";
import UniversityOfWaterlooLogo from "../public/University_of_Waterloo_seal.png";
import CITFLogo from "../public/CITF_logo_ENG.svg";
import CovidEndLogo from "../public/covid-end-logo.png";
import RadioCanadaLogo from "../public/ICIRadio-Canada_Télé(logo).png";
import UniversityOfTorontoLogo from "../public/university-of-toronto-logo.jpg";
import WHOLogo from "../public/WHO-EN-C-H.png";
import Image from "next/image";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export enum Month {
  JANUARY = 'JANUARY',
  FEBRUARY = 'FEBRUARY',
  MARCH = 'MARCH',
  APRIL = 'APRIL',
  MAY = 'MAY',
  JUNE = 'JUNE',
  JULY = 'JULY',
  AUGUST = 'AUGUST',
  SEPTEMBER = 'SEPTEMBER',
  OCTOBER = 'OCTOBER',
  NOVEMBER = 'NOVEMBER',
  DECEMBER = 'DECEMBER',
}

const monthToMonthStringMap: Record<Month, string> = {
  [Month.JANUARY]: 'January',
  [Month.FEBRUARY]: 'February',
  [Month.MARCH]: 'March',
  [Month.APRIL]: 'April',
  [Month.MAY]: 'May',
  [Month.JUNE]: 'June',
  [Month.JULY]: 'July',
  [Month.AUGUST]: 'August',
  [Month.SEPTEMBER]: 'September',
  [Month.OCTOBER]: 'October',
  [Month.NOVEMBER]: 'November',
  [Month.DECEMBER]: 'December',
}

const monthToMonthString = (month: Month): string => monthToMonthStringMap[month];

interface MediaMarqueeEntryProps {
  headline: string;
  year: number;
  month: Month;
  day: number;
  logo: StaticImageData;
  link: string;
  className?: string;
}

export const MediaMarqueeEntry = (props: MediaMarqueeEntryProps) => {
  const {
    headline,
    year,
    month,
    day,
    logo,
    link,
    className,
  } = props;

  return (
    <div className={cn("bg-white ml-2 mr-2 p-1 rounded max-w-96", className ?? '')}>
      <div className="flex justify-center">
        <Image src={logo} alt='' height={70} />
      </div>
      <Link className='text-link text-sm' href={link} target="__blank" rel="noopener noreferrer">{headline}</Link>
      <p className="text-xs text-center">{monthToMonthString(month)} {day.toString()}, {year.toString()}</p>
    </div>
  )
}

export const mediaMarqueeEntryProps: MediaMarqueeEntryProps[] = [{
  headline: 'How we estimated the true death toll of the pandemic',
  year: 2021,
  month: Month.MAY,
  day: 13,
  logo: TheEconomistLogo,
  link: 'https://www.economist.com/graphic-detail/2021/05/13/how-we-estimated-the-true-death-toll-of-the-pandemic'
}, {
  headline: 'Just how big could India’s true Covid toll be?',
  year: 2021,
  month: Month.MAY,
  day: 25,
  logo: NewYorkTimesLogo,
  link: 'https://www.nytimes.com/interactive/2021/05/25/world/asia/india-covid-death-estimates.html'
}, {
  headline: 'Over two thirds of Africans infected by COVID virus since pandemic began - WHO',
  year: 2022,
  month: Month.APRIL,
  day: 7,
  logo: ReutersLogo,
  link: 'https://www.reuters.com/world/africa/over-two-thirds-africans-infected-by-covid-virus-since-pandemic-began-who-2022-04-07'
}, {
  headline: 'COVID in California: Hybrid immunity protects better than infection alone',
  year: 2023,
  month: Month.JANUARY,
  day: 18,
  logo: SanFranciscoChronicleLogo,
  link: 'https://www.sfchronicle.com/health/article/COVID-in-California-17724112.php'
}, {
  headline: 'WHO Analysis: Hybrid Immunity Offers High Protection Against COVID-19',
  year: 2023,
  month: Month.JANUARY,
  day: 18,
  logo: UsNewsLogo,
  link: 'https://www.usnews.com/news/health-news/articles/2023-01-18/who-analysis-hybrid-immunity-offers-high-protection-against-covid-19-hospitalization'
}, {
  headline: 'Covid Immunity Lasts at Least a Year After Infection Plus Shots',
  year: 2023,
  month: Month.JANUARY,
  day: 18,
  logo: BloombergLogo,
  link: 'https://www.bloomberg.com/news/articles/2023-01-18/covid-19-immunity-lasts-at-least-a-year-after-infection-plus-shots-who-says'
}, {
  headline: 'Trying to Solve a Covid Mystery: Africa’s Low Death Rates',
  year: 2022,
  month: Month.MARCH,
  day: 23,
  logo: NewYorkTimesLogo,
  link: 'https://www.nytimes.com/2022/03/23/health/covid-africa-deaths.html'
}, {
  headline: "The world's population is still vulnerable to COVID-19",
  year: 2021,
  month: Month.JUNE,
  day: 25,
  logo: JournalDeQuebecLogo,
  link: 'https://www.journaldequebec.com/2021/06/25/la-population-mondiale-toujours-vulnerable-a-la-covid-19'
}, {
  headline: "Joule announces 2020 Innovation grant recipients",
  year: 2021,
  month: Month.JANUARY,
  day: 23,
  logo: CisionLtdLogo,
  link: 'https://www.newswire.ca/news-releases/joule-announces-2020-innovation-grant-recipients-867798355.html'
}, {
  headline: "When will the COVID-19 pandemic end?",
  year: 2021,
  month: Month.JANUARY,
  day: 20,
  logo: McKinseyLogo,
  link: 'https://www.mckinsey.com/industries/healthcare/our-insights/when-will-the-covid-19-pandemic-end'
}, {
  headline: "SeroTracker: Joule innovation grant recipient",
  year: 2021,
  month: Month.JANUARY,
  day: 15,
  logo: CanadianMedicalAssociationLogo,
  link: 'https://www.cma.ca/resources/alternate-providers-clinical-tools'
}, {
  headline: 'With a virus still evolving, COVID-19 has not said its last word',
  year: 2022,
  month: Month.OCTOBER,
  day: 9,
  logo: BloombergLogo,
  link: 'https://www.bloomberg.com/news/articles/2023-01-18/covid-19-immunity-lasts-at-least-a-year-after-infection-plus-shots-who-says'
}, {
  headline: "McKinsey on healthcare: 2020 year in review",
  year: 2021,
  month: Month.JANUARY,
  day: 1,
  logo: McKinseyLogo,
  link: 'https://www.mckinsey.com/~/media/McKinsey/Industries/Healthcare%20Systems%20and%20Services/Our%20Insights/McKinsey%20on%20Healthcare%202020%20Year%20in%20Review/McKinsey-on-Healthcare-2020-Year-in-Review.pdf'
}, {
  headline: "Study on the global coronavirus infection rate: the number of unreported cases",
  year: 2020,
  month: Month.NOVEMBER,
  day: 24,
  logo: TazLogo,
  link: 'https://taz.de/Studie-zu-globaler-Corona-Infektionsrate/!5730030/'
}, {
  headline: "The Serotracker: Alumni and students develop tool to track Covid-19 spread",
  year: 2020,
  month: Month.NOVEMBER,
  day: 23,
  logo: UniversityOfCalgaryLogo,
  link: 'https://cumming.ucalgary.ca/news/serotracker'
}, {
  headline: "SeroTracker COVID-19 Journey: HIMSS Canadian Prairies Chapter Webinar",
  year: 2020,
  month: Month.NOVEMBER,
  day: 10,
  logo: HIMSSLogo,
  link: 'https://www.himsschapter.org/event/serotracker-covid-19-journey-himss-canadian-prairies-chapter-webinar'
}, {
  headline: "Cheap, Daily Home Tests Are The First Step To Containing The Pandemic",
  year: 2020,
  month: Month.AUGUST,
  day: 17,
  logo: ForbesLogo,
  link: 'https://www.forbes.com/sites/williamhaseltine/2020/08/17/cheap-daily-home-tests-are-the-first-step-to-containing-the-pandemic/?sh=677d47d14ad4'
}, {
  headline: "Adjunct lecturership for CHI Lab DPhil student Rahul Arora.",
  year: 2020,
  month: Month.AUGUST,
  day: 3,
  logo: OxfordUniversityLogo,
  link: 'https://eng.ox.ac.uk/chi/news/adjunct-lecturership-for-rahul'
}, {
  headline: "Covid Radar: taxa de subnotificação de casos de covid-19 na Rocinha chega a 62 vezes [COVID-19 underreporting rate in Rocinha reaches 62 times].",
  year: 2020,
  month: Month.JULY,
  day: 7,
  logo: NewScientistLogo,
  link: 'https://m1newstv.com/subnotificacao-no-brasil-e-na-rocinha-e-a-media-mundial'
}, {
  headline: "What if there is no COVID-19 vaccine? A veteran doctor of the HIV/AIDS crisis provides alternatives",
  year: 2020,
  month: Month.JUNE,
  day: 11,
  logo: MarsLogo,
  link: 'https://www.marsdd.com/magazine/what-if-there-is-no-covid-19-vaccine'
}, {
  headline: "Students build online dashboard to track COVID-19 antibody studies",
  year: 2020,
  month: Month.JUNE,
  day: 2,
  logo: UniversityOfWaterlooLogo,
  link: 'https://uwaterloo.ca/news/engineering-students/students-build-online-dashboard-track-covid-19-antibody'
}, {
  headline: "Global launch of SeroTracker: a COVID-19 antibody testing hub, in partnership with Canada's COVID-19 Immunity Task Force",
  year: 2020,
  month: Month.MAY,
  day: 28,
  logo: CITFLogo,
  link: 'https://www.covid19immunitytaskforce.ca/global-launch-of-serotracker-a-covid-19-antibody-testing-hub-in-partnership-with-canadas-covid-19-immunity-task-force'
}, {
  headline: "Knowledge hub developed to track SARS-CoV antibody studies",
  year: 2020,
  month: Month.MAY,
  day: 24,
  logo: OxfordUniversityLogo,
  link: 'https://www.research.ox.ac.uk/article/2020-05-28-knowledge-hub-developed-to-track-sars-cov-antibody-studies'
}, {
  headline: "Understanding the Virus and Its Unanswered Questions",
  year: 2020,
  month: Month.MAY,
  day: 23,
  logo: BloombergLogo,
  link: 'https://www.bloomberg.com/news/articles/2020-05-06/understanding-the-virus-and-its-unanswered-questions-quicktake'
}, {
  headline: "The pandemic’s true death toll",
  year: 2022,
  month: Month.JANUARY,
  day: 12,
  logo: TheEconomistLogo,
  link: 'https://www.economist.com/graphic-detail/coronavirus-excess-deaths-estimates'
}, {
  headline: "How many of us are likely to have caught the coronavirus so far?",
  year: 2020,
  month: Month.JULY,
  day: 22,
  logo: NewScientistLogo,
  link: 'https://www.newscientist.com/article/mg24632873-000-how-many-of-us-are-likely-to-have-caught-the-coronavirus-so-far'
}, {
  headline: "Inventory of Best Evidence Synthesis",
  year: 2021,
  month: Month.JUNE,
  day: 29,
  logo: CovidEndLogo,
  link: 'https://www.mcmasterforum.org/networks/covid-end/covid-end-inventory/public-health-measures'
}, {
  headline: '800 Million Africans Have Had Covid, WHO Says',
  year: 2022,
  month: Month.APRIL,
  day: 7,
  logo: BloombergLogo,
  link: 'https://www.bloomberg.com/news/articles/2022-04-07/eight-hundred-million-africans-may-have-had-covid-19-who-says'
}, {
  headline: "Avec un virus toujours en évolution, la COVID-19 n’a pas dit son dernier mot",
  year: 2022,
  month: Month.OCTOBER,
  day: 9,
  logo: RadioCanadaLogo,
  link: 'https://ici.radio-canada.ca/nouvelle/1922953/pandemie-covid-variants-omicron-coronavirus-vague'
}, {
  headline: "UCalgary and WHO researchers find hybrid immunity is the best protection against COVID-19",
  year: 2023,
  month: Month.JANUARY,
  day: 20,
  logo: UniversityOfCalgaryLogo,
  link: 'https://ucalgary.ca/news/ucalgary-and-who-researchers-find-hybrid-immunity-best-protection-against-covid-19'
}, {
  headline: "Using AI to make writing systematic reviews easier and faster",
  year: 2025,
  month: Month.MARCH,
  day: 4,
  logo: UniversityOfTorontoLogo,
  link: 'https://temertymedicine.utoronto.ca/news/using-ai-make-writing-systematic-reviews-easier-and-faster'
}, {
  headline: "WHO EPI-WIN Webinar: launch of MERS-tracker: an interactive dashboard to support evidence based decision making",
  year: 2024,
  month: Month.NOVEMBER,
  day: 21,
  logo: WHOLogo,
  link: 'https://www.who.int/news-room/events/detail/2024/11/21/default-calendar/who-epi-win-webinar-launch-of-mers-tracker-an-interactive-dashboard-to-support-evidence-based-decision-making'
}];

export const MediaMarquee = () => {
  return (
    <div className="bg-background pt-2 pb-2 w-full">
      <Marquee>
        {mediaMarqueeEntryProps.map((props) => <MediaMarqueeEntry key={props.link} {...props} />)}
      </Marquee>
    </div>
  );
}