"use client";

import { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface HomepageTileProps {
  header: string;
  subtitle: string;
  backgroundImage: StaticImageData;
  backgroundImageAttribution: string;
  route: string;
  className?: string;
}

export const HomepageTile = ({
  header,
  subtitle,
  backgroundImage,
  backgroundImageAttribution,
  route,
}: HomepageTileProps) => {
  const router = useRouter();
  return (
    <div
      className={`w-1/2 h-full flex justify-start items-center rounded-md border-solid border-2 border-sky-200 bg-white`}
      about={backgroundImageAttribution}
      style={{
        backgroundImage: `url(${backgroundImage.src})`,
        maxWidth: backgroundImage.width,
        maxHeight: backgroundImage.height,
      }}
    >
      <div className={"rounded-md bg-sky-200 w-[40%] p-2 ml-3"}>
        <h2 className={"font-bold pb-2 text-xl"}> {header} </h2>
        <p> {subtitle} </p>
        <button
          className={"flex justify-center rounded-md p-1 mt-2 hover:bg-black/10"}
          onClick={() => router.push(route)}
        >
          <p> See Dashboard </p>
          <ArrowRight className="ml-2.5" />
        </button>
      </div>
    </div>
  );
};
