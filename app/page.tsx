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
} from "@/hooks/arbovirus/useArboStatistics";
import request from "graphql-request";
import { SeroTrackerIntroduction } from "./serotracker-introduction";

interface TrackerButtonProps {
  titleSuffix: string;
  description: string;
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
          className="flex w-full h-full-screen bg-no-repeat bg-cover bg-center p-4 overflow-auto"
          style={{
            backgroundImage: `url(${SeroMap.src})`,
          }}
        >
          <div className="md:grid grid-cols-4 w-full rounded-md p-4 mb-4 min-h-1/2 h-fit text-background bg-white/90">
            <div className="col-span-2 col-start-1 col-end-3 row-span-1 h-full">
              <SeroTrackerIntroduction />
            </div>
            <div className="col-span-2 col-start-3 col-end-5 row-span-1">
              <iframe
                src="https://drive.google.com/file/d/1cLslLkwI57f2oKI45utkKdOtlW9ZCWpm/preview"
                className="aspect-video w-full"
                allow="autoplay"
                allowFullScreen={true}
              />
              <div className="flex">
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
                    description="SeroTracker description"
                    icon={faVirus}
                    bgColor="bg-sc2virus"
                    textColor="text-sc2virus"
                    href={"/pathogen/sarscov2/dashboard"}
                    className="mt-4"
                  />
                ) : (
                  <TrackerButton
                    titleSuffix="Original SARS-CoV-2"
                    description="SeroTracker description"
                    icon={faVirus}
                    bgColor="bg-sc2virus"
                    textColor="text-sc2virus"
                    href={"https://serotracker.com/en/Explore"}
                    className="mt-4"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <h3 className="flex text-background bg-white rounded-md lg:px-16 justify-center p-8 w-full">
          {`We have data from ${formatNumber(4642)} seroprevalence studies in ${formatNumber(148)} countries and territories including ${formatNumber(38260890)} participants across both our dashboards`}
        </h3>
        <div className="p-8 w-full bg-background">
          <div className="bg-white rounded-md w-full flex justify-center lg:justify-between px-8 lg:px-16 py-4 lg:py-6 items-center flex-wrap lg:flex-nowrap">
            <Image className={"p-2 lg:p-0"} src={"/WHO-EN-C-H.png"} alt={""} width={200} height={100} />
            <Image
            className={"p-2 lg:p-0"}
              src={"/University-Of-Calgary-Logo.png"}
              alt={""}
              width={200}
              height={100}
            />
            <Image
            className={"p-2 lg:p-0"}
              src={"/public-health-agency.svg"}
              alt={""}
              width={200}
              height={100}
            />
            <Image className={"p-2 lg:p-0"} src={"/amc-joule.png"} alt={""} width={200} height={100} />
            <Image
            className={"p-2 lg:p-0"}
              src={"/CITF_logo_ENG.svg"}
              alt={""}
              width={200}
              height={100}
            />
          </div>
          <div className="text-white mt-8 text-justify">
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
