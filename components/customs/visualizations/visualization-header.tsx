import { ZoomIn, DownloadCloud, X, Settings, ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { isSafeReferrerLink } from "@/utils/referrer-link-util";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { VisualizationDisplayNameType, VisualizationInformation } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { useMemo } from "react";
import assertNever from "assert-never";
import { Dropdown } from "../dropdown/dropdown";
import { cn } from "@/lib/utils";

interface DisabledButtonConfig {
  enabled: false;
}

type EnabledButtonConfig<AdditionalButtonInformation> = {
  enabled: true;
} & AdditionalButtonInformation;

export type ButtonConfig<AdditionalButtonInformation> =
  | DisabledButtonConfig
  | EnabledButtonConfig<AdditionalButtonInformation>;

export type ZoomInButtonAdditionalButtonConfig = { referrerRoute: string };
export type DownloadButtonAdditionalButtonConfig = {};
export type CloseButtonAdditionalButtonConfig = { referrerRoute: string | undefined | null };
export type CustomizeButtonAdditionalButtonConfig = { onClick: () => void };
export type LeftArrowButtonAdditionalButtonConfig = { onClick: () => void, disabledButVisible: boolean };
export type RightArrowButtonAdditionalButtonConfig = { onClick: () => void, disabledButVisible: boolean };

export type GetUrlParameterFromVisualizationIdFunction<TVisualizationId extends string, TVisualizationUrlParameter extends string> =
  (input: {visualizationId: TVisualizationId}) => {urlParameter: TVisualizationUrlParameter};

interface ZoomInButtonProps<TVisualizationId extends string, TVisualizationUrlParameter extends string> {
  configuration: EnabledButtonConfig<ZoomInButtonAdditionalButtonConfig> & { id: string };
  visualizationId: TVisualizationId;
  router: AppRouterInstance;
  getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<TVisualizationId, TVisualizationUrlParameter>;
}

interface DownloadButtonProps {
  configuration: EnabledButtonConfig<DownloadButtonAdditionalButtonConfig> & { id: string };
  downloadVisualization: () => void;
}

interface CloseButtonProps {
  configuration: EnabledButtonConfig<CloseButtonAdditionalButtonConfig> & { id: string };
  router: AppRouterInstance;
}

interface CustomizeButtonProps {
  configuration: EnabledButtonConfig<CustomizeButtonAdditionalButtonConfig> & { id: string };
}

interface LeftArrowButtonProps {
  configuration: EnabledButtonConfig<LeftArrowButtonAdditionalButtonConfig> & { id: string };
}

interface RightArrowButtonProps {
  configuration: EnabledButtonConfig<RightArrowButtonAdditionalButtonConfig> & { id: string };
}

interface AllButtonConfigurations {
  zoomInButton: ButtonConfig<ZoomInButtonAdditionalButtonConfig> & { id: string };
  downloadButton: ButtonConfig<DownloadButtonAdditionalButtonConfig> & { id: string };
  closeButton: ButtonConfig<CloseButtonAdditionalButtonConfig> & { id: string };
  customizeButton: ButtonConfig<CustomizeButtonAdditionalButtonConfig> & { id: string };
  leftArrowButton: ButtonConfig<LeftArrowButtonAdditionalButtonConfig> & { id: string };
  rightArrowButton: ButtonConfig<RightArrowButtonAdditionalButtonConfig> & { id: string };
}

const DownloadButton = (props: DownloadButtonProps) => (
  <button
    id={props.configuration.id}
    className="mr-2 p-2 hover:bg-gray-100 rounded-full"
    onClick={() => props.downloadVisualization()}
    aria-label="Download visualization"
    title="Download visualization"
  >
    <DownloadCloud />
  </button>
);

const CloseButton = (props: CloseButtonProps) => (
  <button
    id={props.configuration.id}
    className="mr-2 p-2 hover:bg-gray-100 rounded-full"
    hidden={
      !props.configuration.referrerRoute ||
      !isSafeReferrerLink(props.configuration.referrerRoute)
    }
    onClick={() => {
      if (
        props.configuration.referrerRoute &&
        isSafeReferrerLink(props.configuration.referrerRoute)
      ) {
        props.router.push(props.configuration.referrerRoute);
      }
    }}
    aria-label="Close Visualization"
    title="Close Visualization"
  >
    <X />
  </button>
);

const ZoomInButton = <
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string
>(
  props: ZoomInButtonProps<TVisualizationId, TVisualizationUrlParameter>
) => (
  <button
    id={props.configuration.id}
    onClick={() =>
      props.router.push(
        `visualizations?visualization=${
          props.getUrlParameterFromVisualizationId({
            visualizationId: props.visualizationId,
          }).urlParameter
        }&referrerRoute=${props.configuration.referrerRoute}`
      )
    }
    aria-label="See visualization in fullscreen"
    title="See visualization in fullscreen"
    className="p-2 hover:bg-gray-100 rounded-full"
  >
    <ZoomIn />
  </button>
);

const CustomizeButton = (props: CustomizeButtonProps) => (
  <button
    id={props.configuration.id}
    aria-label="Customize Visualization"
    title="Customize Visualization"
    className="mr-2 p-2 hover:bg-gray-100 rounded-full"
    onClick={() => props.configuration.onClick()}
  >
    <Settings />
  </button>
);

const LeftArrowButton = (props: LeftArrowButtonProps) => (
  <button
    id={props.configuration.id}
    aria-label="Move to the previous page"
    aria-disabled={props.configuration.disabledButVisible}
    disabled={props.configuration.disabledButVisible}
    title="Move to the previous page"
    className={cn("mr-2 p-2 rounded-full", !props.configuration.disabledButVisible ? "text-black hover:bg-gray-100" : "bg-gray-200 text-gray-400")}
    onClick={!props.configuration.disabledButVisible ? () => props.configuration.onClick() : () => {}}
  >
    <ArrowLeft />
  </button>
);

const RightArrowButton = (props: RightArrowButtonProps) => (
  <button
    id={props.configuration.id}
    aria-label="Move to the next page"
    aria-disabled={props.configuration.disabledButVisible}
    disabled={props.configuration.disabledButVisible}
    title="Move to the next page"
    className={cn("mr-2 p-2 rounded-full", !props.configuration.disabledButVisible ? "text-black hover:bg-gray-100" : "bg-gray-200 text-gray-400")}
    onClick={!props.configuration.disabledButVisible ? () => props.configuration.onClick() : () => {}}
  >
    <ArrowRight />
  </button>
);

interface VisualizationHeaderProps<
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>,
  TCustomizationModalDropdownOption extends string,
  TVisualizationDisplayNameDropdownOption extends string,
  TSecondVisualizationDisplayNameDropdownOption extends string,
  TThirdVisualizationDisplayNameDropdownOption extends string,
  TFourthVisualizationDisplayNameDropdownOption extends string
> {
  visualizationInformation: VisualizationInformation<
    TVisualizationId,
    TVisualizationUrlParameter,
    TEstimate,
    TCustomizationModalDropdownOption,
    TVisualizationDisplayNameDropdownOption,
    TSecondVisualizationDisplayNameDropdownOption,
    TThirdVisualizationDisplayNameDropdownOption,
    TFourthVisualizationDisplayNameDropdownOption
  >;
  data: TEstimate[];
  getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<TVisualizationId, TVisualizationUrlParameter>;
  downloadVisualization: () => void;
  buttonConfiguration: AllButtonConfigurations;
}

export const VisualizationHeader = <
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>,
  TCustomizationModalDropdownOption extends string,
  TVisualizationDisplayNameDropdownOption extends string,
  TSecondVisualizationDisplayNameDropdownOption extends string,
  TThirdVisualizationDisplayNameDropdownOption extends string,
  TFourthVisualizationDisplayNameDropdownOption extends string
>(
  props: VisualizationHeaderProps<
    TVisualizationId,
    TVisualizationUrlParameter,
    TEstimate,
    TCustomizationModalDropdownOption,
    TVisualizationDisplayNameDropdownOption,
    TSecondVisualizationDisplayNameDropdownOption,
    TThirdVisualizationDisplayNameDropdownOption,
    TFourthVisualizationDisplayNameDropdownOption
  >
) => {
  const router = useRouter();
  const { data } = props;
  const { titleTooltipContent, getDisplayName } = props.visualizationInformation;

  const titleTooltip = useMemo(() => titleTooltipContent ? (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="h-5 w-5 text-gray-500 cursor-pointer inline ml-2 ignore-for-visualization-download"
          >
            &#9432;
          </div>
        </TooltipTrigger>
        <TooltipContent
          style={{
            position: "absolute",
            top: "50px", // position below the trigger
            left:"-120px",
            minWidth: "230px", // Set a minimum width
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <div
            className="bg-background w-full p-4 rounded text-white"
          >
            {titleTooltipContent}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : null, [titleTooltipContent])

  const visualizationTitle = useMemo(() => {
    const displayName = getDisplayName({ data });

    if(displayName.type === VisualizationDisplayNameType.STANDARD) {
      return ( 
        <h3 className="w-full text-center text-lg inline">
          {displayName.displayName}
          {titleTooltip}
        </h3>
      )
    }

    if(displayName.type === VisualizationDisplayNameType.WITH_DROPDOWN) {
      return (
        <div className="w-full text-center text-lg inline">
          <h3 className="inline leading-[45px]">{displayName.beforeDropdownHeaderText} </h3>
          <div className="inline leading-[45px]">
            <Dropdown {...displayName.dropdownProps}/>
          </div>
          <h3 className="inline leading-[45px]">{displayName.afterDropdownHeaderText} </h3>
          {titleTooltip}
        </div>
      )
    }

    if(displayName.type === VisualizationDisplayNameType.WITH_DOUBLE_DROPDOWN) {
      return (
        <div className="w-full text-center text-lg inline">
          <h3 className="inline">{displayName.beforeBothDropdownsHeaderText} </h3>
          <div className="inline leading-[45px]">
            <Dropdown {...displayName.firstDropdownProps}/>
          </div>
          <h3 className="inline">{displayName.betweenDropdownsHeaderText} </h3>
          <div className="inline leading-[45px]">
            <Dropdown {...displayName.secondDropdownProps}/>
          </div>
          <h3 className="inline">{displayName.afterBothDropdownsHeaderText} </h3>
          {titleTooltip}
        </div>
      )
    }

    if(displayName.type === VisualizationDisplayNameType.WITH_TRIPLE_DROPDOWN) {
      return (
        <div className="w-full text-center text-lg inline">
          <h3 className="inline leading-[45px]">{displayName.beforeAllDropdownsHeaderText} </h3>
          <div className="inline leading-[45px]">
            <Dropdown {...displayName.firstDropdownProps}/>
          </div>
          <h3 className="inline leading-[45px]">{displayName.betweenFirstAndSecondDropdownHeaderText} </h3>
          <div className="inline leading-[45px]">
            <Dropdown {...displayName.secondDropdownProps}/>
          </div>
          <h3 className="inline leading-[45px]">{displayName.betweenSecondAndThirdDropdownHeaderText} </h3>
          <div className="inline leading-[45px]">
            <Dropdown {...displayName.thirdDropdownProps}/>
          </div>
          <h3 className="inline leading-[45px]">{displayName.afterAllDropdownsHeaderText} </h3>
          {titleTooltip}
        </div>
      )
    }

    if(displayName.type === VisualizationDisplayNameType.WITH_QUADRUPLE_DROPDOWN) {
      return (
        <div className="w-full text-center text-lg inline">
          <h3 className="inline leading-[45px]">{displayName.beforeAllDropdownsHeaderText} </h3>
          <div className="inline leading-[45px]">
            <Dropdown {...displayName.firstDropdownProps}/>
          </div>
          <h3 className="inline leading-[45px]">{displayName.betweenFirstAndSecondDropdownHeaderText} </h3>
          <div className="inline leading-[45px]">
            <Dropdown {...displayName.secondDropdownProps}/>
          </div>
          <h3 className="inline leading-[45px]">{displayName.betweenSecondAndThirdDropdownHeaderText} </h3>
          <div className="inline leading-[45px]">
            <Dropdown {...displayName.thirdDropdownProps}/>
          </div>
          <h3 className="inline leading-[45px]">{displayName.betweenThirdAndFourthDropdownHeaderText} </h3>
          <div className="inline leading-[45px]">
            <Dropdown {...displayName.fourthDropdownProps}/>
          </div>
          <h3 className="inline leading-[45px]">{displayName.afterAllDropdownsHeaderText} </h3>
          {titleTooltip}
        </div>
      )
    }

    assertNever(displayName);
  }, [titleTooltip, getDisplayName, data]);

  return (
    <div className="flex py-4">
      {visualizationTitle}
      {props.buttonConfiguration.leftArrowButton.enabled && (
        <LeftArrowButton
          configuration={props.buttonConfiguration.leftArrowButton}
        />
      )}
      {props.buttonConfiguration.rightArrowButton.enabled && (
        <RightArrowButton
          configuration={props.buttonConfiguration.rightArrowButton}
        />
      )}
      {props.buttonConfiguration.downloadButton.enabled && (
        <DownloadButton
          downloadVisualization={() => props.downloadVisualization()}
          configuration={props.buttonConfiguration.downloadButton}
        />
      )}
      {props.buttonConfiguration.customizeButton.enabled && (
        <CustomizeButton
          configuration={props.buttonConfiguration.customizeButton}
        />
      )}
      {props.buttonConfiguration.closeButton.enabled && (
        <CloseButton
          router={router}
          configuration={props.buttonConfiguration.closeButton}
        />
      )}
      {props.buttonConfiguration.zoomInButton.enabled && (
        <ZoomInButton
          router={router}
          configuration={props.buttonConfiguration.zoomInButton}
          getUrlParameterFromVisualizationId={props.getUrlParameterFromVisualizationId}
          visualizationId={props.visualizationInformation.id}
        />
      )}
    </div>
  );
};
