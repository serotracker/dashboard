import { assertNever } from "assert-never";
import { PopUpContentColouredPillListRow, PopUpContentColouredPillListRowProps } from "./pop-up-content-rows/pop-up-content-coloured-pill-list-row";
import { PopUpContentDateRangeRow, PopUpContentDateRangeRowProps } from "./pop-up-content-rows/pop-up-content-date-range-row";
import { PopUpContentLocationRow, PopUpContentLocationRowProps } from "./pop-up-content-rows/pop-up-content-location-row";
import { PopUpContentNumberRow, PopUpContentNumberRowProps } from "./pop-up-content-rows/pop-up-content-number-row";
import { PopUpContentTextRow, PopUpContentTextRowProps } from "./pop-up-content-rows/pop-up-content-text-row";
import { cn } from "@/lib/utils";
import { GenericMapPopUpWidth } from "./generic-map-pop-up";
import { PopUpContentDateRow, PopUpContentDateRowProps } from "./pop-up-content-rows/pop-up-content-date-row";

export enum PopUpContentRowType {
  DATE = "DATE",
  DATE_RANGE = "DATE_RANGE",
  NUMBER = "NUMBER",
  LOCATION = "LOCATION",
  TEXT = "TEXT",
  COLOURED_PILL_LIST = "COLOURED_PILL_LIST"
}

export interface PopUpContentRowBaseProps {
  title: string;
  bottomPaddingEnabled?: boolean;
  rightPaddingEnabled?: boolean;
  contentBolded?: boolean;
}

export type PopUpContentRowProps = 
  | PopUpContentDateRangeRowProps
  | PopUpContentDateRowProps
  | PopUpContentNumberRowProps
  | PopUpContentLocationRowProps
  | PopUpContentTextRowProps
  | PopUpContentColouredPillListRowProps;

export enum PopupContentTextAlignment {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export interface PopUpContentRowRibbonConfiguration {
  ribbonColourClassname: string
}

interface GenericPopUpContentRowProps {
  title: string,
  content: JSX.Element | string | string[] | null | undefined,
  textAlignment: PopupContentTextAlignment | undefined;
  rightPaddingEnabled?: boolean;
  bottomPaddingEnabled?: boolean;
  contentBolded?: boolean;
  ribbonConfiguration?: PopUpContentRowRibbonConfiguration;
}

export const GenericPopUpContentRow = (props: GenericPopUpContentRowProps): React.ReactNode => (
  <div className={cn(
    "flex w-full",
    (props.bottomPaddingEnabled ?? true) ? "mb-2" : "",
    (props.rightPaddingEnabled ?? true) ? "mr-2" : ""
  )}>
    {props.ribbonConfiguration && <div className={cn('w-2 mr-2', props.ribbonConfiguration.ribbonColourClassname)} /> }
    <div className={cn("flex justify-between items-center w-full")}>
      <div className={"text-md font-semibold"}>{props.title}</div>
      <div className={cn(
        "w-2/3",
        props.textAlignment === PopupContentTextAlignment.RIGHT ? "text-right" : "",
        props.contentBolded === true ? "font-semibold" : ""
      )}>
        {props.content}
      </div>
    </div>
  </div>
)

export const PopUpContentRow = (props: PopUpContentRowProps): React.ReactNode => {
  if(props.type === PopUpContentRowType.COLOURED_PILL_LIST) {
    return <PopUpContentColouredPillListRow {...props} />
  }

  if(props.type === PopUpContentRowType.DATE_RANGE) {
    return <PopUpContentDateRangeRow {...props} />
  }

  if(props.type === PopUpContentRowType.DATE) {
    return <PopUpContentDateRow {...props} />
  }

  if(props.type === PopUpContentRowType.NUMBER) {
    return <PopUpContentNumberRow {...props} />
  }

  if(props.type === PopUpContentRowType.TEXT) {
    return <PopUpContentTextRow {...props} />
  }
  if(props.type === PopUpContentRowType.LOCATION) {
    return <PopUpContentLocationRow {...props} />
  }

  assertNever(props);
}

