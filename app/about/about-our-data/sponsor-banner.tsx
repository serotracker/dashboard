import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface SponsorInformation {
  imageUrl: string;
  imageAlt: string;
  link: string;
}

export enum Sponsor {
  COVID_19_IMMUNITY_TASK_FORCE = "COVID_19_IMMUNITY_TASK_FORCE",
  CENTRE_FOR_HEALTH_INFORMATICS = "CENTRE_FOR_HEALTH_INFORMATICS",
  PUBLIC_HEALTH_AGENCY = "PUBLIC_HEALTH_AGENCY",
  WORLD_HEALTH_ORGANIZATION = "WORLD_HEALTH_ORGANIZATION",
  AMC_JOULE = "AMC_JOULE",
  COLORADO_PUBLIC_SCHOOL_OF_HEALTH = "COLORADO_PUBLIC_SCHOOL_OF_HEALTH",
  EUROPEAN_COMMISSION = "EUROPEAN_COMMISSION",
  RECODID = "RECODID",
  CANADIAN_INSTITUTES_OF_HEALTH_RESEARCH = "CANADIAN_INSTITUTES_OF_HEALTH_RESEARCH",
  HEIDELBERG_UNIVERSITY = "HEIDELBERG_UNIVERSITY",
}

interface SponsorBannerProps {
  className: string;
  sponsors: Sponsor[];
}

const sponsorToInformationMap: Record<Sponsor, SponsorInformation> = {
  [Sponsor.COVID_19_IMMUNITY_TASK_FORCE]: {
    imageUrl:
      "https://www.covid19immunitytaskforce.ca/wp-content/themes/pena-lite-child/CITF_logo_ENG.svg",
    link: "https://www.covid19immunitytaskforce.ca/",
    imageAlt: "COVID-19 Immunity Task Force logo",
  },
  [Sponsor.CENTRE_FOR_HEALTH_INFORMATICS]: {
    imageUrl: "/University-Of-Calgary-Logo.png",
    link: "https://cumming.ucalgary.ca/centres/centre-health-informatics",
    imageAlt: "Centre for Health Informatics logo",
  },
  [Sponsor.PUBLIC_HEALTH_AGENCY]: {
    imageUrl: "/public-health-agency.svg",
    link: "https://www.canada.ca/en/public-health.html/",
    imageAlt: "Public Health Agency logo",
  },
  [Sponsor.WORLD_HEALTH_ORGANIZATION]: {
    imageUrl: "/WHO-EN-C-H.png",
    link: "https://www.who.int/",
    imageAlt: "World Health Organization logo",
  },
  [Sponsor.AMC_JOULE]: {
    imageUrl: "/amc-joule.png",
    link: "https://joulecma.ca/",
    imageAlt: "AMC Joule logo",
  },
  [Sponsor.COLORADO_PUBLIC_SCHOOL_OF_HEALTH]: {
    imageUrl: "/colorado.jpg",
    link: "https://coloradosph.cuanschutz.edu/",
    imageAlt: "Colorado School of Public Health logo",
  },
  [Sponsor.EUROPEAN_COMMISSION]: {
    imageUrl: "/europeancommission_horizontal.jpg",
    link: "https://commission.europa.eu/index_en",
    imageAlt: "European Commission logo",
  },
  [Sponsor.RECODID]: {
    imageUrl: "/recodid.png",
    link: "https://recodid.eu/",
    imageAlt: "ReCoDID logo",
  },
  [Sponsor.CANADIAN_INSTITUTES_OF_HEALTH_RESEARCH]: {
    imageUrl: "/cihr-irsc-logo.png",
    link: "https://cihr-irsc.gc.ca/e/193.html",
    imageAlt: "Canadian Institutes of Health Research logo",
  },
  [Sponsor.HEIDELBERG_UNIVERSITY]: {
    imageUrl: "/heidelberg.svg",
    link: "https://www.uni-heidelberg.de/en",
    imageAlt: "Heidelberg University logo",
  },
};

export const SponsorBanner = (props: SponsorBannerProps) => (
  <div className={cn("flex justify-around flex-wrap", props.className)}>
    {props.sponsors.map((sponsor) => {
      const sponsorInformation = sponsorToInformationMap[sponsor];

      return (
        <Link
          href={sponsorInformation.link}
          target="__blank"
          rel="noopener noreferrer"
          className="flex my-4 justify-center"
        >
          <Image
            src={sponsorInformation.imageUrl}
            alt={sponsorInformation.imageAlt}
            className="flex object-contain"
            width={120}
            height={36}
          />
        </Link>
      )
    })}
  </div>
);
