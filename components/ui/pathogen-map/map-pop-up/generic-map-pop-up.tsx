import { MouseEventHandler, useState } from "react";
import { PopUpContentRow, PopUpContentRowProps, PopUpContentRowType, PopupContentTextAlignment } from "./pop-up-content-rows";
import { cn } from "@/lib/utils";
import { AlternateViewConfiguration, AlternateViewGenericMapPopUpContent } from "./map-pop-up-alternate-configuration";
import { Button } from "../../button";

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

type EnabledBannerTextConfiguration = {
  enabled: true;
  bannerText: string
  bannerColourClassname: string;
  isTextBolded: boolean;
  isTextCentered: boolean;
} & ({
  alternateViewButtonEnabled: true;
  alternateViewEnableButtonText: string;
  alternateViewDisableButtonText: string;
  alternateViewButtonClassname: string;
} | {
  alternateViewButtonEnabled: false;
})

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

const GenericMapPopUpTextBanner = (props: EnabledBannerTextConfiguration & {
  alternateViewEnabled: boolean;
  enableAlternateView: () => void;
  disableAlternateView: () => void;
}): React.ReactNode => (
  <div className={cn('flex justify-between w-full py-2 px-4', props.bannerColourClassname)}>
    <div className={cn(
      !props.alternateViewButtonEnabled ? "w-full" : "",
      props.isTextBolded ? "font-semibold" : "",
      props.isTextCentered ? "text-center" : ""
    )}>
      {!!props.isTextBolded
        ? <b> {props.bannerText} </b>
        : <p className="text-sm"> {props.bannerText} </p>
      }
    </div>
    {(!!props.alternateViewButtonEnabled && !props.alternateViewEnabled) &&
      <Button className={cn("h-5", props.alternateViewButtonClassname)} onClick={() => props.enableAlternateView()}>
        {props.alternateViewEnableButtonText}
      </Button>
    }
    {(!!props.alternateViewButtonEnabled && props.alternateViewEnabled) &&
      <Button className={cn("h-5", props.alternateViewButtonClassname)} onClick={() => props.disableAlternateView()}>
        {props.alternateViewDisableButtonText}
      </Button>
    }
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
  EXTRA_WIDE = 'EXTRA_WIDE',
  EXTRA_EXTRA_WIDE = 'EXTRA_EXTRA_WIDE',
  AUTO = 'AUTO'
}

const widthEnumToWidthClassnameMap: {[key in Exclude<GenericMapPopUpWidth, GenericMapPopUpWidth.AUTO>]: string } = {
  [GenericMapPopUpWidth.THIN]: 'w-[260px]',
  [GenericMapPopUpWidth.MEDIUM]: 'w-[360px]',
  [GenericMapPopUpWidth.WIDE]: 'w-[460px]',
  [GenericMapPopUpWidth.EXTRA_WIDE]: 'w-[560px]',
  [GenericMapPopUpWidth.EXTRA_EXTRA_WIDE]: 'w-[660px]'
}

export const genericMapPopUpWidthEnumToWidthPxMap: {[key in Exclude<GenericMapPopUpWidth, GenericMapPopUpWidth.AUTO>]: number } = {
  [GenericMapPopUpWidth.THIN]: 260,
  [GenericMapPopUpWidth.MEDIUM]: 360,
  [GenericMapPopUpWidth.WIDE]: 460,
  [GenericMapPopUpWidth.EXTRA_WIDE]: 560,
  [GenericMapPopUpWidth.EXTRA_EXTRA_WIDE]: 660
}

interface StandardViewGenericMapPopUpContentProps {
  rows: PopUpContentRowProps[];
}

const StandardViewGenericMapPopUpContent = (props: StandardViewGenericMapPopUpContentProps) => {
  return props.rows.map((row) => 
    <PopUpContentRow key={row.title} {...row} />
  );
}

interface GenericMapPopUpProps {
  width: GenericMapPopUpWidth;
  headerConfiguration: HeaderConfiguration;
  subtitleConfiguration: SubtitleConfiguration;
  topBannerConfiguration: BannerConfiguration;
  rows: PopUpContentRowProps[];
  bottomBannerConfiguration: BannerConfiguration;
  alternateViewConfiguration: AlternateViewConfiguration;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

export const GenericMapPopUp = (props: GenericMapPopUpProps) => {
  const [ alternateViewEnabled, setAlternateViewEnabled ] = useState<boolean>(false);

  return (
    <div
      className={cn(
        props.width !== GenericMapPopUpWidth.AUTO ? widthEnumToWidthClassnameMap[props.width] : '',
        "bg-white/60 backdrop-blur-md pt-2 rounded-lg",
        props.className ? props.className : ''
      )}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      <div className={"py-2 px-4"}>
        <GenericMapPopUpHeader {...props.headerConfiguration} />
        {props.subtitleConfiguration.enabled === true && <GenericMapPopUpSubtitle {...props.subtitleConfiguration}/>}
      </div>
      {(props.topBannerConfiguration.enabled === true && isEnabledBannerTextConfiguration(props.topBannerConfiguration)) &&
        <GenericMapPopUpTextBanner
          {...props.topBannerConfiguration}
          alternateViewEnabled={alternateViewEnabled}
          enableAlternateView={() => setAlternateViewEnabled(true)}
          disableAlternateView={() => setAlternateViewEnabled(false)}
        />
      }
      {(props.topBannerConfiguration.enabled === true && isEnabledBannerRowValueConfiguration(props.topBannerConfiguration)) &&
        <GenericMapPopUpRowValueBanner {...props.topBannerConfiguration}/>
      }
      <div className={"py-2 px-4 max-h-[250px] overflow-auto"}>
        {(!alternateViewEnabled || props.alternateViewConfiguration.enabled === false) && <StandardViewGenericMapPopUpContent rows={props.rows} />}
        {alternateViewEnabled && props.alternateViewConfiguration.enabled === true && <AlternateViewGenericMapPopUpContent alternateViewConfiguration={props.alternateViewConfiguration} />}
      </div>
      {(props.bottomBannerConfiguration.enabled === true && isEnabledBannerTextConfiguration(props.bottomBannerConfiguration)) &&
        <GenericMapPopUpTextBanner
          {...props.bottomBannerConfiguration}
          alternateViewEnabled={alternateViewEnabled}
          enableAlternateView={() => setAlternateViewEnabled(true)}
          disableAlternateView={() => setAlternateViewEnabled(false)}
        />
      }
      {(props.bottomBannerConfiguration.enabled === true && isEnabledBannerRowValueConfiguration(props.bottomBannerConfiguration)) &&
        <GenericMapPopUpRowValueBanner {...props.bottomBannerConfiguration}/>
      }
    </div>
  );
}