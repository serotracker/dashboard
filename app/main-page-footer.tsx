import Image from "next/image";

const formatNumber = (numericValue?: number) => {
  return (numericValue?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') ?? 0);
}

export const MainPageFooter = () => {
  return (
    <>
    <h3 className="flex text-background bg-white rounded-md lg:px-16 justify-center p-8 w-full">
      {process.env.NEXT_PUBLIC_MERS_TRACKER_ENABLED === 'true'
        ? `We have data from ${formatNumber(4682)} seroprevalence studies in ${formatNumber(148)} countries and territories including ${formatNumber(38389552)} participants across our three dashboards`
        : `We have data from ${formatNumber(4642)} seroprevalence studies in ${formatNumber(148)} countries and territories including ${formatNumber(38260890)} participants across both our dashboards`
      }
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
    </>
  )
}