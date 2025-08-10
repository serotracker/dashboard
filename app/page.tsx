import SeroMap from "../public/SeroMap.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLungs,
  faMosquito,
  faVirus,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CustomQueryClientProvider from "@/contexts/custom-query-client-provider";
import getQueryClient from "@/components/customs/getQueryClient";
import {
  ArbovirusDataStatisticsQuery,
} from "@/gql/graphql";
import {
  arbovirusDataStatisticsQueryKey,
  arbovirusDataStatistics,
} from "@/hooks/arbovirus/useArboStatistics";
import request from "graphql-request";
import { SeroTrackerIntroduction } from "./serotracker-introduction";
import { ArboTrackerTutorialVideoFrame } from "@/components/customs/arbotracker-tutorial-video-frame";
import { MediaMarquee, PublicationMarquee } from "./marquees";
import { MainPageFooter } from "./main-page-footer";

interface TrackerButtonProps {
  titleSuffix: string;
  icon: IconDefinition;
  textColor: string;
  bgColor: string;
  href: string;
  className?: string
}

function TrackerButton(props: TrackerButtonProps) {
  return (
    <Link
      className={cn(
        "w-full rounded-md text-white bg-background flex flex-col mb-4 lg:mb-0 mr-4 last:mr-0 overflow-hidden p-2 transition-all group hover:cursor-pointer",
        `hover:${props.bgColor}`,
        props.className
      )}
      href={props.href}
    >
      <div className={cn("flex justify-between items-center w-full")}>
        <h3 className={cn("p-2 w-full text-white")}>
          <span
            className={cn(
              "p-1 text-background rounded-md mr-1 bg-white",
              `group-hover:${props.textColor}`
            )}
          >
            {props.titleSuffix}
          </span>
          Tracker
        </h3>
        <FontAwesomeIcon
          icon={props.icon}
          width={36}
          height={36}
          className={cn("mr-4 text-white")}
        />
      </div>
    </Link>
  );
}

export default async function Home() {
  const queryClient = getQueryClient();

  const arboDataStats =
    await queryClient.fetchQuery<ArbovirusDataStatisticsQuery>({
      queryKey: [arbovirusDataStatisticsQueryKey],
      queryFn: () =>
        request(
          process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? "",
          arbovirusDataStatistics
        ),
    });

  return (
    <CustomQueryClientProvider>
      <div className="h-full overflow-auto">
        <div
          className="flex w-full h-full-screen bg-no-repeat bg-cover bg-center py-4 overflow-auto"
          style={{
            backgroundImage: `url(${SeroMap.src})`,
          }}
        >
          <div>
            <div className="md:grid grid-cols-4 rounded-md p-4 mx-4 mb-4 min-h-1/2 h-fit text-background bg-white/90">
              <div className="col-span-2 col-start-1 col-end-3 row-span-1 h-full">
                <SeroTrackerIntroduction />
              </div>
              <div className="col-span-2 col-start-3 col-end-5 row-span-1">
                <ArboTrackerTutorialVideoFrame />
                <div className="flex">
                  {/*
                  These comments are for tailwindcss to pickup these classes so we do not need to add too many props
                  hover:bg-arbovirus
                  hover:text-arbovirus
                  group-hover:text-arbovirus
                  */}
                  <TrackerButton
                    titleSuffix="Arbo"
                    icon={faMosquito}
                    bgColor="bg-arbovirus"
                    textColor="text-arbovirus"
                    href={"/pathogen/arbovirus/dashboard"}
                    className="mt-4"
                  />
                  {/*
                  hover:bg-sc2virus
                  hover:text-sc2virus
                  group-hover:text-sc2virus
                  */}
                  {process.env.NEXT_PUBLIC_SARS_COV_2_TRACKER_ENABLED ? (
                    <TrackerButton
                      titleSuffix="SC2"
                      icon={faVirus}
                      bgColor="bg-sc2virus"
                      textColor="text-sc2virus"
                      href={"/pathogen/sarscov2/dashboard"}
                      className="mt-4"
                    />
                  ) : (
                    <TrackerButton
                      titleSuffix="Original SARS-CoV-2"
                      icon={faVirus}
                      bgColor="bg-sc2virus"
                      textColor="text-sc2virus"
                      href={"https://sc2.serotracker.com/en/Explore"}
                      className="mt-4"
                    />
                  )}
                  {/*
                  hover:bg-mers
                  hover:text-mers
                  group-hover:text-mers
                  */}
                  {process.env.NEXT_PUBLIC_MERS_TRACKER_ENABLED && (
                    <TrackerButton
                      titleSuffix="MERS"
                      icon={faLungs}
                      bgColor="bg-mers"
                      textColor="text-mers"
                      href={"/pathogen/mers/dashboard"}
                      className="mt-4"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white/90 rounded-md pb-2 pt-2 mx-4" style={{width: "calc(100vw - 2rem)"}}>
              <p className='ml-2 mr-2 mb-1'> In the Media</p>
              <MediaMarquee />
              <div className="mt-1">
                <Link className="ml-2 mr-2 text-link" href="/publications"> See the full list of our global media features and list of academic publications from the SeroTracker team</Link>
              </div>
            </div>
            <div className="bg-white/90 rounded-md pb-2 pt-2 mt-2 mb-2 mx-4" style={{width: "calc(100vw - 2rem)"}}>
              <div className='ml-2 mr-2 mb-1'>
                <p className="inline"> A selection of our most cited work in infectious disease seroepidemiology and evidence synthesis - See our full academic publications list </p>
                <Link className='inline text-link' href='/publications' target="__blank" rel="noopener noreferrer">here</Link>
              </div>
              <PublicationMarquee />
            </div>
            <MainPageFooter />
          </div>
        </div>
      </div>
    </CustomQueryClientProvider>
  );
}
