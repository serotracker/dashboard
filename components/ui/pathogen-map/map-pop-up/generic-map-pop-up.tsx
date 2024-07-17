import React from "react";
import { PopUpContentRow, PopUpContentRowProps, PopUpContentRowType, PopupContentTextAlignment } from "./pop-up-content-rows";
import { cn } from "@/lib/utils";

export enum HeaderConfigurationTextAlignment {
  LEFT = 'LEFT',
  CENTER = 'CENTER',
}

interface HeaderConfiguration {
  text: string;
  textAlignment: HeaderConfigurationTextAlignment;
}

const headerTextAlignmentToClassnameMap: {[key in HeaderConfigurationTextAlignment]: string} = {
  [HeaderConfigurationTextAlignment.LEFT]: '',
  [HeaderConfigurationTextAlignment.CENTER]: 'text-center'
}

const GenericMapPopUpHeader = (props: HeaderConfiguration): React.ReactNode => (
  <div className={cn(headerTextAlignmentToClassnameMap[props.textAlignment], "text-lg font-bold")}>
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

interface EnabledBannerTextConfiguration {
  enabled: true;
  bannerText: string
  bannerColourClassname: string;
  isTextBolded: boolean;
  isTextCentered: boolean;
}

interface EnabledBannerRowValueConfiguration {
  enabled: true;
  label: string;
  value: string;
  valueTextAlignment: PopupContentTextAlignment | undefined;
  bannerColourClassname: string;
}

interface DisabledBannerConfiguration {
  enabled: false;
}

const isEnabledBannerTextConfiguration = (
  configuration: EnabledBannerTextConfiguration | Omit<EnabledBannerRowValueConfiguration, 'popUpWidth'>
): configuration is EnabledBannerTextConfiguration => 'bannerText' in configuration;

const isEnabledBannerRowValueConfiguration = (
  configuration: EnabledBannerTextConfiguration | Omit<EnabledBannerRowValueConfiguration, 'popUpWidth'>
): configuration is Omit<EnabledBannerRowValueConfiguration, 'popUpWidth'> => 'label' in configuration;

type BannerConfiguration = EnabledBannerTextConfiguration | Omit<EnabledBannerRowValueConfiguration, 'popUpWidth'> | DisabledBannerConfiguration;

const GenericMapPopUpTextBanner = (props: EnabledBannerTextConfiguration): React.ReactNode => (
  <div className={cn('flex justify-between w-full py-2 px-4', props.bannerColourClassname)}>
    <div className={cn("w-full", props.isTextBolded ? "font-semibold" : "", props.isTextCentered ? "text-center" : "")}>
      {!!props.isTextBolded
        ? <b> {props.bannerText} </b>
        : <p className="text-sm"> {props.bannerText} </p>
      }
    </div>
  </div>
);

const GenericMapPopUpRowValueBanner = (props: EnabledBannerRowValueConfiguration): React.ReactNode => (
  <div className={cn('flex justify-between w-full py-2 px-4', props.bannerColourClassname)}>
    <PopUpContentRow
      title={props.label}
      type={PopUpContentRowType.TEXT}
      text={props.value}
      contentTextAlignment={props.valueTextAlignment}
      bottomPaddingEnabled={false}
      rightPaddingEnabled={false}
      contentBolded={true}
    />
  </div>
);

export enum GenericMapPopUpWidth {
  THIN = 'THIN',
  MEDIUM = 'MEDIUM',
  WIDE = 'WIDE',
  AUTO = 'AUTO'
}

const widthEnumToWidthClassnameMap: {[key in Exclude<GenericMapPopUpWidth, GenericMapPopUpWidth.AUTO>]: string } = {
  [GenericMapPopUpWidth.THIN]: 'w-[260px]',
  [GenericMapPopUpWidth.MEDIUM]: 'w-[360px]',
  [GenericMapPopUpWidth.WIDE]: 'w-[460px]'
}

export const genericMapPopUpWidthEnumToWidthPxMap: {[key in Exclude<GenericMapPopUpWidth, GenericMapPopUpWidth.AUTO>]: number } = {
  [GenericMapPopUpWidth.THIN]: 260,
  [GenericMapPopUpWidth.MEDIUM]: 360,
  [GenericMapPopUpWidth.WIDE]: 460
}

interface GenericMapPopUpProps {
  width: GenericMapPopUpWidth;
  headerConfiguration: HeaderConfiguration;
  subtitleConfiguration: SubtitleConfiguration;
  topBannerConfiguration: BannerConfiguration;
  rows: PopUpContentRowProps[];
  bottomBannerConfiguration: BannerConfiguration;
}

export const GenericMapPopUp = (props: GenericMapPopUpProps) => {
  return (
    <div className={cn(
      props.width !== GenericMapPopUpWidth.AUTO ? widthEnumToWidthClassnameMap[props.width] : '',
      "bg-white/60 backdrop-blur-md pt-2 rounded-lg"
    )}>
      <div className={"py-2 px-4"}>
        <GenericMapPopUpHeader {...props.headerConfiguration} />
        {props.subtitleConfiguration.enabled === true && <GenericMapPopUpSubtitle {...props.subtitleConfiguration}/>}
      </div>
      {(props.topBannerConfiguration.enabled === true && isEnabledBannerTextConfiguration(props.topBannerConfiguration)) && <GenericMapPopUpTextBanner {...props.topBannerConfiguration}/>}
      {(props.topBannerConfiguration.enabled === true && isEnabledBannerRowValueConfiguration(props.topBannerConfiguration)) && <GenericMapPopUpRowValueBanner {...props.topBannerConfiguration}/>}
      <div className={"py-2 px-4 max-h-[250px] overflow-auto"}>
        {props.rows.map((row) => 
          <PopUpContentRow key={row.title} {...row} />
        )}
      </div>
      {(props.bottomBannerConfiguration.enabled === true && isEnabledBannerTextConfiguration(props.bottomBannerConfiguration)) && <GenericMapPopUpTextBanner {...props.bottomBannerConfiguration}/>}
      {(props.bottomBannerConfiguration.enabled === true && isEnabledBannerRowValueConfiguration(props.bottomBannerConfiguration)) && <GenericMapPopUpRowValueBanner {...props.bottomBannerConfiguration}/>}
    </div>
  );
}