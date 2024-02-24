import { ZoomIn, DownloadCloud, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  VisualizationId,
  VisualizationInformation,
  getVisualizationInformationFromVisualizationId,
} from "../../visualizations/visualizations";
import { isSafeReferrerLink } from "@/utils/referrer-link-util";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

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

interface ZoomInButtonProps {
  configuration: EnabledButtonConfig<ZoomInButtonAdditionalButtonConfig> & { id: string };
  visualizationId: VisualizationId;
  router: AppRouterInstance;
}

interface DownloadButtonProps {
  configuration: EnabledButtonConfig<DownloadButtonAdditionalButtonConfig> & { id: string };
  downloadVisualization: () => void;
}

interface CloseButtonProps {
  configuration: EnabledButtonConfig<CloseButtonAdditionalButtonConfig> & { id: string };
  router: AppRouterInstance;
}

interface AllButtonConfigurations {
  zoomInButton: ButtonConfig<ZoomInButtonAdditionalButtonConfig> & { id: string };
  downloadButton: ButtonConfig<DownloadButtonAdditionalButtonConfig> & { id: string };
  closeButton: ButtonConfig<CloseButtonAdditionalButtonConfig> & { id: string };
}

const DownloadButton = (props: DownloadButtonProps) => (
  <button
    id={props.configuration.id}
    className="mr-4"
    onClick={() => props.downloadVisualization()}
    aria-label="Download visualization"
  >
    <DownloadCloud />
  </button>
);

const CloseButton = (props: CloseButtonProps) => (
  <button
    className="mr-4"
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
  >
    <X />
  </button>
);

const ZoomInButton = (props: ZoomInButtonProps) => (
  <button
    id={props.configuration.id}
    onClick={() =>
      props.router.push(
        `visualizations?visualization=${
          getVisualizationInformationFromVisualizationId({
            visualizationId: props.visualizationId,
          }).urlParameter
        }&referrerRoute=${props.configuration.referrerRoute}`
      )
    }
    aria-label="See visualization in fullscreen"
  >
    <ZoomIn />
  </button>
);

interface VisualizationHeaderProps {
  visualizationInformation: VisualizationInformation;
  downloadVisualization: () => void;
  buttonConfiguration: AllButtonConfigurations;
}

export const VisualizationHeader = (props: VisualizationHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex py-4">
      <h3 className="w-full text-center text-lg">
        {props.visualizationInformation.displayName}
      </h3>
      {props.buttonConfiguration.downloadButton.enabled && (
        <DownloadButton
          downloadVisualization={() => props.downloadVisualization()}
          configuration={props.buttonConfiguration.downloadButton}
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
          visualizationId={props.visualizationInformation.id}
        />
      )}
    </div>
  );
};
