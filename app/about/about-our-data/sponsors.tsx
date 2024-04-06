'use client'

import Image from 'next/image';
import Link from 'next/link';

import { cn } from "@/lib/utils";

interface SponsorsProps {
  className: string;
}

export const Sponsors = (props: SponsorsProps) => (
  <div className={cn("flex justify-around flex-wrap", props.className)}>
    <Link href="https://www.covid19immunitytaskforce.ca/" target="__blank" rel="noopener noreferrer" className="flex my-4 justify-center">
      <Image src={"https://www.covid19immunitytaskforce.ca/wp-content/themes/pena-lite-child/CITF_logo_ENG.svg"} alt={"COVID-19 Immunity Task Force Logo"} className="flex object-contain" width={120} height={36}/>
    </Link>
    <Link href="https://cumming.ucalgary.ca/centres/centre-health-informatics" target="__blank" rel="noopener noreferrer" className="flex my-4 justify-center">
        <Image width={120} height={36} src={"/University-Of-Calgary-Logo.png"} alt={"Centre for Health Informatics logo"} className="flex object-contain"/>
    </Link>
    <Link href="https://www.canada.ca/en/public-health.html/" target="__blank" rel="noopener noreferrer" className="flex my-4 justify-center">
        <Image width={120} height={36} src={"/public-health-agency.svg"} alt={"Public Health Agency Logo"} className="flex object-contain"/>
    </Link>
    <Link href="https://www.who.int/" target="__blank" rel="noopener noreferrer" className="flex my-4 justify-center">
        <Image width={120} height={36} src={"/WHO-EN-C-H.png"} alt={"World Health Organization Logo"} className="flex object-contain"/>
    </Link>
    <Link href="https://joulecma.ca/" target="__blank" rel="noopener noreferrer" className="flex my-4 justify-center">
        <Image width={120} height={36} src={"/amc-joule.png"} alt={"AMC Joule logo"} className="flex object-contain"/>
    </Link>
  </div>
)