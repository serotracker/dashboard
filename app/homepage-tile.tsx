"use client";

import "./homepage-tile.css";
import { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface HomepageTileProps {
  header: string;
  subtitle: string;
  backgroundImage: StaticImageData;
  route: string;
}

export const HomepageTile = ({
  header,
  subtitle,
  backgroundImage,
  route,
}: HomepageTileProps) => {
  const router = useRouter();
  return (
    <div
      className={"w-1/2 h-full flex justify-center items-center"}
      style={{
        backgroundImage: `url(${backgroundImage.src})`,
        border: "1px solid",
        justifyContent: "flex-start",
        maxWidth: backgroundImage.width,
        maxHeight: backgroundImage.height,
        borderRadius: "10px",
      }}
    >
      <div className={"homepage-tile-text-container"}>
        <h2 className={"homepage-tile-header"}> {header} </h2>
        <p> {subtitle} </p>
        <button
          className={"homepage-tile-button"}
          onClick={() => router.push(route)}
        >
          <p> See Dashboard </p>
          <ArrowRight style={{ marginLeft: "10px" }} />
        </button>
      </div>
    </div>
  );
};
