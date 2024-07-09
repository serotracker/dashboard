import { useRouter, useSearchParams } from "next/navigation";
import { NotFound } from "../not-found";
import { RechartsVisualization } from "@/components/customs/visualizations/recharts-visualization";
import { typedObjectEntries } from "@/lib/utils";
import { GetUrlParameterFromVisualizationIdFunction } from "@/components/customs/visualizations/visualization-header";
import { UseModalInput } from "@/components/ui/modal/modal";
import { DropdownProps } from "@/components/customs/dropdown/dropdown";

interface GetDisplayNameInput<TEstimate extends Record<string, unknown>> {
  data: TEstimate[]
}

interface RenderVisualizationInput<TEstimate extends Record<string, unknown>> {
  data: TEstimate[];
  highlightedDataPoint: TEstimate | undefined;
  hideArbovirusDropdown: boolean | undefined;
}

export enum VisualizationDisplayNameType {
  "STANDARD" = "STANDARD",
  "WITH_DROPDOWN" = "WITH_DROPDOWN",
}

interface StandardVisualizationDisplayName {
  type: VisualizationDisplayNameType.STANDARD;
  displayName: string;
}

interface VisualizationDisplayNameWithDropdown<TVisualizationDisplayNameDropdownOption extends string> {
  type: VisualizationDisplayNameType.WITH_DROPDOWN;
  beforeDropdownHeaderText: string;
  dropdownProps: DropdownProps<TVisualizationDisplayNameDropdownOption>
  afterDropdownHeaderText: string;
}

type VisualizationDisplayName<TVisualizationDisplayNameDropdownOption extends string> = 
  | StandardVisualizationDisplayName
  | VisualizationDisplayNameWithDropdown<TVisualizationDisplayNameDropdownOption>;

export const isStandardVisualizationDisplayName = <TVisualizationDisplayNameDropdownOption extends string>(
  displayName: VisualizationDisplayName<TVisualizationDisplayNameDropdownOption> 
): displayName is StandardVisualizationDisplayName => displayName.type === VisualizationDisplayNameType.STANDARD;

export const isVisualizationDisplayNameWithDropdown = <TVisualizationDisplayNameDropdownOption extends string>(
  displayName: VisualizationDisplayName<TVisualizationDisplayNameDropdownOption> 
): displayName is VisualizationDisplayNameWithDropdown<TVisualizationDisplayNameDropdownOption> => displayName.type === VisualizationDisplayNameType.WITH_DROPDOWN;

export interface VisualizationInformation<
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>,
  TCustomizationModalDropdownOption extends string,
  TVisualizationDisplayNameDropdownOption extends string
> {
  id: TVisualizationId;
  urlParameter: TVisualizationUrlParameter;
  getDisplayName: (input: GetDisplayNameInput<TEstimate>) => VisualizationDisplayName<TVisualizationDisplayNameDropdownOption>;
  titleTooltipContent?: string | React.ReactNode;
  renderVisualization: (input: RenderVisualizationInput<TEstimate>) => React.ReactNode;
  customizationModalConfiguration?: UseModalInput<TCustomizationModalDropdownOption>;
}

interface FiltersComponentProps {
  className?: string;
}

type AddVisualizationInformationInput<
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>,
  TNewInformation extends Record<string, unknown>,
  TCustomizationModalDropdownOption extends string,
  TVisualizationDisplayNameDropdownOption extends string
> = {
  additionalInformation: Record<TVisualizationId, TNewInformation>;
  allVisualizationInformation: Record<TVisualizationId, VisualizationInformation<
    TVisualizationId,
    TVisualizationUrlParameter,
    TEstimate,
    TCustomizationModalDropdownOption,
    TVisualizationDisplayNameDropdownOption
  >>;
}

type AddVisualizationInformationOutput<
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>,
  TNewInformation extends Record<string, unknown>,
  TCustomizationModalDropdownOption extends string,
  TVisualizationDisplayNameDropdownOption extends string
> = (TNewInformation & VisualizationInformation<
  TVisualizationId,
  TVisualizationUrlParameter,
  TEstimate,
  TCustomizationModalDropdownOption,
  TVisualizationDisplayNameDropdownOption
>)[];

export const addToVisualizationInformation = <
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>,
  TNewInformation extends Record<string, unknown>,
  TCustomizationModalDropdownOption extends string,
  TVisualizationDisplayNameDropdownOption extends string
>(
  input: AddVisualizationInformationInput<
    TVisualizationId,
    TVisualizationUrlParameter,
    TEstimate,
    TNewInformation,
    TCustomizationModalDropdownOption,
    TVisualizationDisplayNameDropdownOption
  >
): AddVisualizationInformationOutput<
  TVisualizationId,
  TVisualizationUrlParameter,
  TEstimate,
  TNewInformation,
  TCustomizationModalDropdownOption,
  TVisualizationDisplayNameDropdownOption
> => {
  return typedObjectEntries(input.additionalInformation).map(([key, value]) => ({
    ...input.allVisualizationInformation[key],
    ...value
  }));
}

interface GenericPathogenVisualizationsPageProps<
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>,
  TCustomizationModalDropdownOption extends string,
  TVisualizationDisplayNameDropdownOption extends string
> {
  data: TEstimate[];
  isValidVisualizationUrlParameter:
    (visualizationUrlParameter: string) => visualizationUrlParameter is TVisualizationUrlParameter;
  getVisualizationInformationFromVisualizationUrlParameter:
    (visualizationUrlParameter: TVisualizationUrlParameter) => VisualizationInformation<
      TVisualizationId,
      TVisualizationUrlParameter,
      TEstimate,
      TCustomizationModalDropdownOption,
      TVisualizationDisplayNameDropdownOption
    > | undefined;
  filtersComponent: (props: FiltersComponentProps) => React.ReactNode;
  getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<TVisualizationId, TVisualizationUrlParameter>;
}

export const GenericPathogenVisualizationsPage = <
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>,
  TCustomizationModalDropdownOption extends string,
>(props: GenericPathogenVisualizationsPageProps<
  TVisualizationId,
  TVisualizationUrlParameter,
  TEstimate,
  TCustomizationModalDropdownOption,
  any
>):React.ReactNode => {
  const searchParams = useSearchParams();
  const visualizationUrlParameter = searchParams.get('visualization');
  const referrerRoute = searchParams.get('referrerRoute');
  
  if(!visualizationUrlParameter || !props.isValidVisualizationUrlParameter(visualizationUrlParameter)) {
    return <NotFound />;
  }

  const visualizationInformation = props.getVisualizationInformationFromVisualizationUrlParameter(visualizationUrlParameter);

  if(!visualizationInformation) {
    return <NotFound />;
  }

  return (
    <div className="w-screen overflow-y-hidden grid grid-cols-12 grid-rows-2 h-full-screen">
      <props.filtersComponent className="col-span-2 row-span-2 overflow-y-scroll p-4 border-black border-r-2 h-full" />
      <RechartsVisualization
        className="flex-col flex h-full overflow-y-scroll col-span-10 row-span-2"
        data={props.data}
        highlightedDataPoint={undefined}
        hideArbovirusDropdown={undefined}
        visualizationInformation={visualizationInformation}
        getUrlParameterFromVisualizationId={props.getUrlParameterFromVisualizationId}
        buttonConfig={{
          downloadButton: {
            enabled: true,
          },
          zoomInButton: {
            enabled: false,
          },
          closeButton: {
            enabled: true,
            referrerRoute
          }
        }}
      />
    </div>
  )
}