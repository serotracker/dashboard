import SeroMap from "../public/SeroMap.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMosquito,
  faVirus,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TrackerButtonProps {
  titleSuffix: string;
  description: string;
  icon: IconDefinition;
  textColor: string;
  bgColor: string;
}

function TrackerButton(props: TrackerButtonProps) {
  return (
    <div
      className={cn(
        "w-full rounded-md text-white bg-white/90 flex flex-col mb-4 lg:mr-4 lg:last:mr-0 h-full overflow-hidden p-2 transition-all group hover:cursor-pointer"
        , `hover:${props.bgColor}`
      )}
    >

      <div className={cn("flex justify-between items-center w-full")}>
        <h2 className={cn("p-2 w-full group-hover:text-white", props.textColor)}>
          <span className={cn("p-1 text-white rounded-md mr-1 group-hover:bg-white", props.bgColor, `group-hover:${props.textColor}`)}>
            {props.titleSuffix}
          </span>
          Tracker
        </h2>
        <FontAwesomeIcon
          icon={props.icon}
          width={36}
          height={36}
          className={cn("mr-4 group-hover:text-white", props.textColor)}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="h-full overflow-auto">
      <div
        className="flex w-full h-full-screen bg-no-repeat p-4 lg:p-8"
        style={{
          backgroundImage: `url(${SeroMap.src})`,
        }}
      >
        <div className="h-full w-full rounded-md  text-background p-8">
          <div className="w-full bg-white/90 rounded-md p-4 mb-4">
          <h1 className=" w-fit p-2 rounded-md">
            SeroTracker
          </h1>
          <h3 className="rounded-md p-2">
            Your Go to Source for COVID-19 and Arbovirus Seroprevalence Data
          </h3>
          <div className="p-2 rounded-md">
            <p className=" w-fit mb-2">
              We synthesize findings from thousands of COVID-19 and Arbovirus
              seroprevalence studies worldwide, collect and standardize the data
              we extract from them, provide useful analytics on the data and
              extract monthly insights relating to tredns and patterns we find
              in the data
            </p>
            <p className=" w-fit mb-2">
              We conduct an ongoing systematic review to track serosurveys
              (antibody testing-based surveillance efforts) around the world and
              visualize findings on this dashboard.
            </p>
            <p>
              Checkout our dashboards below!
            </p>
          </div>
          </div>
          
          <h3 className="relative flex overflow-x-hidden text-background  bg-white/90 rounded-md mb-4 ">
            <div className="animate-marquee whitespace-nowrap p-8">
              <span>
                We have data from <b>4,742,112</b> Participants accross
              </span>
              <span>
                <b> 253,221 </b> Estimates from
              </span>
              <span>
                <b> 94,213</b> Sources spanning
              </span>
              <span>
                <b> 149</b> countries and territories
              </span>
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-8 px-4">
              <span>
                We have data for <b>4,742,112</b> Participants accross
              </span>
              <span>
                <b> 253,221 </b> Estimates from
              </span>
              <span>
                <b> 94,213</b> Sources spanning
              </span>
              <span>
                <b> 149</b> countries and territories
              </span>
            </div>
          </h3>
          <div className="flex flex-col lg:flex-row">
            {/*
              These comments are for tailwindcss to pickup these classes so we do not need to add too many props
              hover:bg-green-700
              hover:text-green-700
              group-hover:text-green-700
            */}
            <TrackerButton
              titleSuffix="Arbo"
              description="ArboTracker description"
              icon={faMosquito}
              bgColor="bg-green-700"
              textColor="text-green-700"
            />
            {/*
              hover:bg-blue-700
              hover:text-blue-700
              group-hover:text-blue-700
            */}
            <TrackerButton
              titleSuffix="SC2"
              description="SeroTracker description"
              icon={faVirus}
              bgColor="bg-blue-700"
              textColor="text-blue-700"
            />
          </div>
        </div>
      </div>
      <div className="p-6 w-full bg-background">
        <div className="bg-white rounded-md w-full flex justify-between px-8 lg:px-16 py-4 lg:py-6 items-center flex-wrap lg:flex-nowrap">
        <Image src={"/WHO-EN-C-H.png"} alt={""} width={150} height={100}/>
        <Image src={"/University-Of-Calgary-Logo.png"} alt={""} width={150} height={100}/>
        <Image src={"/WHO-EN-C-H.png"} alt={""} width={150} height={100}/>
        <Image src={"/University-Of-Calgary-Logo.png"} alt={""} width={150} height={100}/>
        <Image src={"/WHO-EN-C-H.png"} alt={""} width={150} height={100}/>
        </div>
      </div>
    </div>
  );
}
