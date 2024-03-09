import SeroMap from "../public/SeroMap.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMosquito,
  faVirus,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ArboStats, { formatNumber } from "@/components/customs/arboStats";
import CustomQueryClientProvider from "@/contexts/custom-query-client-provider";
import getQueryClient from "@/components/customs/getQueryClient";
import {
  ArbovirusDataStatisticsQuery,
} from "@/gql/graphql";
import {
  arbovirusDataStatisticsQueryKey,
  arbovirusDataStatistics,
} from "@/hooks/useArboStatistics";
import request from "graphql-request";

interface TrackerButtonProps {
  titleSuffix: string;
  description: string;
  icon: IconDefinition;
  textColor: string;
  bgColor: string;
  href: string;
}

function TrackerButton(props: TrackerButtonProps) {
  return (
    <Link
      className={cn(
        "w-full rounded-md text-white bg-background flex flex-col mb-4 lg:mb-0 lg:mr-4 lg:last:mr-0 h-full overflow-hidden p-2 transition-all group hover:cursor-pointer",
        `hover:${props.bgColor}`
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
          className="flex w-full h-full-screen bg-no-repeat p-4"
          style={{
            backgroundImage: `url(${SeroMap.src})`,
          }}
        >
          <div className="flex flex-col justify-between w-full rounded-md p-4 mb-4 h-1/2 text-background bg-white/90">
            <div className="w-full">
              <h1 className=" w-fit p-2 rounded-md">SeroTracker</h1>
              <h3 className="rounded-md p-2">
                Your Go to Source for COVID-19 and Arbovirus Seroprevalence Data
              </h3>
              <div className="p-2 rounded-md">
                <p className=" w-fit mb-2">
                  We synthesize findings from thousands of COVID-19 and
                  Arbovirus seroprevalence studies worldwide, collect and
                  standardize the data we extract from them, provide useful
                  analytics on the data and extract monthly insights relating to
                  tredns and patterns we find in the data
                </p>
                <p className=" w-fit mb-2">
                  We conduct an ongoing systematic review to track serosurveys
                  (antibody testing-based surveillance efforts) around the world
                  and visualize findings on this dashboard.
                </p>
                <p>Checkout our dashboards below!</p>
              </div>
            </div>
            <div className="flex w-1/2 flex-col lg:flex-row self-end">
              {/*
              These comments are for tailwindcss to pickup these classes so we do not need to add too many props
              hover:bg-arbovirus
              hover:text-arbovirus
              group-hover:text-arbovirus
            */}
              <TrackerButton
                titleSuffix="Arbo"
                description="ArboTracker description"
                icon={faMosquito}
                bgColor="bg-arbovirus"
                textColor="text-arbovirus"
                href={"/pathogen/arbovirus/dashboard"}
              />
              {/*
              hover:bg-sc2virus
              hover:text-sc2virus
              group-hover:text-sc2virus
            */}
              {process.env.NEXT_PUBLIC_SARS_COV_2_TRACKER_ENABLED ? (
                <TrackerButton
                  titleSuffix="SC2"
                  description="SeroTracker description"
                  icon={faVirus}
                  bgColor="bg-sc2virus"
                  textColor="text-sc2virus"
                  href={"/pathogen/sarscov2/dashboard"}
                />
              ) : (
                <TrackerButton
                  titleSuffix="legacy SC2"
                  description="SeroTracker description"
                  icon={faVirus}
                  bgColor="bg-sc2virus"
                  textColor="text-sc2virus"
                  href={"https://serotracker.com/en/Explore"}
                />
              )}
            </div>
          </div>
        </div>
        <h3 className="flex text-background bg-white rounded-md px-16 justify-center p-8 whitespace-nowrap">
          We have data from{" "}
          {formatNumber(arboDataStats.arbovirusDataStatistics.patricipantCount)}{" "}
          Participants accross{" "}
          {formatNumber(arboDataStats.arbovirusDataStatistics.estimateCount)}{" "}
          Estimates from{" "}
          {formatNumber(arboDataStats.arbovirusDataStatistics.sourceCount)}{" "}
          Sources spanning{" "}
          {formatNumber(arboDataStats.arbovirusDataStatistics.countryCount)}{" "}
          countries and territories
        </h3>
        <div className="p-6 w-full bg-background">
          <div className="bg-white rounded-md w-full flex justify-between px-8 lg:px-16 py-4 lg:py-6 items-center flex-wrap lg:flex-nowrap">
            <Image src={"/WHO-EN-C-H.png"} alt={""} width={150} height={100} />
            <Image
              src={"/University-Of-Calgary-Logo.png"}
              alt={""}
              width={150}
              height={100}
            />
            <Image
              src={"/public-health-agency.svg"}
              alt={""}
              width={150}
              height={100}
            />
            <Image src={"/amc-joule.png"} alt={""} width={150} height={100} />
            <Image
              src={"/CITF_logo_ENG.svg"}
              alt={""}
              width={150}
              height={100}
            />
          </div>
          <div className="text-white px-8 mt-8 text-justify">
            <p className="mb-3 font-bold">MAP DISCLAIMER</p>
            <p>
              The designations employed and the presentation of the material
              available on this platform does not imply the expression of any
              opinion whatsoever on the part of WHO, SeroTracker, or
              SeroTracker&apos;s partners concerning the legal status of any
              country, territory, city or area or of its authorities, or
              concerning the delimitation of its frontiers or boundaries. Dotted
              and dashed lines on maps represent approximate border lines for
              which there may not yet be full agreement.
            </p>
          </div>
        </div>
      </div>
    </CustomQueryClientProvider>
  );
}
