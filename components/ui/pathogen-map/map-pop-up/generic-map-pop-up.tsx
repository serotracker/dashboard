import React from "react";
import { PopUpContentRow, PopUpContentRowProps } from "./pop-up-content-rows";
import { cn } from "@/lib/utils";

interface HeaderConfiguration {
  text: string;
}

const GenericMapPopUpHeader = (props: HeaderConfiguration): React.ReactNode => (
  <div className="text-lg font-bold">
    {props.text}
  </div>
);

interface EnabledSubtitleConfiguration {
  enabled: true;
  text: string;
  link: string | undefined;
}

interface DisabledSubtitleConfiguration {
  enabled: false;
}

type SubtitleConfiguration = EnabledSubtitleConfiguration | DisabledSubtitleConfiguration;

const GenericMapPopUpSubtitle = (props: EnabledSubtitleConfiguration): React.ReactNode => (
  <div className={cn("text-sm", !!props.link ? "text-link" : "")}>
    { !!props.link
      ? <a href={props.link} target="_blank" rel="noopener noreferrer"> {props.text} </a>
      : props.text
    }
  </div>
);

interface EnabledBannerConfiguration {
  enabled: true;
  bannerText: string
  bannerColourClassname: string;
  isTextBolded: boolean;
  isTextCentered: boolean;
}

interface DisabledBannerConfiguration {
  enabled: false;
}

type BannerConfiguration = EnabledBannerConfiguration | DisabledBannerConfiguration;

const GenericMapPopUpBanner = (props: EnabledBannerConfiguration): React.ReactNode => (
  <div className={cn('flex justify-between w-full py-2 px-4', props.bannerColourClassname)}>
    <div className={cn("w-full", props.isTextBolded ? "font-semibold" : "", props.isTextCentered ? "text-center" : "")}>
      {!!props.isTextBolded
        ? <b> {props.bannerText} </b>
        : <p className="text-sm"> {props.bannerText} </p>
      }
    </div>
  </div>
);

interface GenericMapPopUpProps {
  headerConfiguration: HeaderConfiguration;
  subtitleConfiguration: SubtitleConfiguration;
  topBannerConfiguration: BannerConfiguration;
  rows: PopUpContentRowProps[];
  bottomBannerConfiguration: BannerConfiguration;
}

export const GenericMapPopUp = (props: GenericMapPopUpProps) => {
  return (
    <div className="w-[460px] bg-white/60 backdrop-blur-md pt-2 rounded-lg">
      <div className={"py-2 px-4"}>
        <GenericMapPopUpHeader {...props.headerConfiguration} />
        {props.subtitleConfiguration.enabled === true && <GenericMapPopUpSubtitle {...props.subtitleConfiguration}/>}
      </div>
      {props.topBannerConfiguration.enabled === true && <GenericMapPopUpBanner {...props.topBannerConfiguration}/>}
      <div className={"py-2 px-4 max-h-[250px] overflow-auto"}>
        {props.rows.map((row) => 
          <PopUpContentRow {...row} />
        )}
      </div>
      {props.bottomBannerConfiguration.enabled === true && <GenericMapPopUpBanner {...props.bottomBannerConfiguration}/>}
    </div>
  );
}