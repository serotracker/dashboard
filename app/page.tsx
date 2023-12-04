import "./page.css";
import Image from "next/image";
import ArboTrackerScreenshot from "../public/ArbotrackerScreenshot.png";
import SarsCov2TrackerScreenshot from "../public/SarsCov2TrackerScreenshot.png";
import { HomepageTile } from "./homepage-tile";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between homepage">
      <div>
        <div className="flex flex-start homepage-heading-container">
          <Image
            src={"/SerotrackerLogo.svg"}
            alt={""}
            width={120}
            height={120}
            style={{
              marginRight: "20px",
            }}
          />
          <div>
            <h1 className={"homepage-heading-text"}>SeroTracker</h1>
            <h2>
              A global dashboard standardizing pathogen and seroprevalence data
            </h2>
          </div>
        </div>
      </div>
      <div className={"flex w-full h-half-screen homepage-tiles-container"}>
        <HomepageTile
          header="SARSCoV2Tracker"
          subtitle="Access a collection of seroprevalence studies for SARS-CoV-2 that span across 38 million participants and 148 countries."
          backgroundImage={SarsCov2TrackerScreenshot}
          route="https://serotracker.com"
        />
        <HomepageTile
          header="ArboTracker"
          subtitle="View over a thousand seroprevalence estimates for arboviruses that span across over seventy countries and seven decades."
          backgroundImage={ArboTrackerScreenshot}
          route="/pathogen/arbovirus/dashboard"
        />
      </div>
    </div>
  );
}
