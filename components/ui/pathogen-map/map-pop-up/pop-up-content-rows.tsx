import { assertNever } from "assert-never";
import { PopUpContentColouredPillListRow, PopUpContentColouredPillListRowProps } from "./pop-up-content-rows/pop-up-content-coloured-pill-list-row";
import { PopUpContentDateRangeRow, PopUpContentDateRangeRowProps } from "./pop-up-content-rows/pop-up-content-date-range-row";
import { PopUpContentLocationRow, PopUpContentLocationRowProps } from "./pop-up-content-rows/pop-up-content-location-row";
import { PopUpContentNumberRow, PopUpContentNumberRowProps } from "./pop-up-content-rows/pop-up-content-number-row";
import { PopUpContentTextRow, PopUpContentTextRowProps } from "./pop-up-content-rows/pop-up-content-text-row";

export enum PopUpContentRowType {
  DATE_RANGE = "DATE_RANGE",
  NUMBER = "NUMBER",
  LOCATION = "LOCATION",
  TEXT = "TEXT",
  COLOURED_PILL_LIST = "COLOURED_PILL_LIST"
}

export interface PopUpContentRowBaseProps {
  title: string;
}

export type PopUpContentRowProps = 
  | PopUpContentDateRangeRowProps
  | PopUpContentNumberRowProps
  | PopUpContentLocationRowProps
  | PopUpContentTextRowProps
  | PopUpContentColouredPillListRowProps;

interface GenericPopUpContentRowProps {
  title: string,
  content: JSX.Element | string | string[] | null | undefined
}

export const GenericPopUpContentRow = (props: GenericPopUpContentRowProps): React.ReactNode => (
  <div className={"flex justify-between items-center mb-2 w-full mr-2"}>
    <div className={"text-md font-semibold"}>{props.title}</div>
    <div className={"w-2/3"}>{props.content}</div>
  </div>
)

export const PopUpContentRow = (props: PopUpContentRowProps): React.ReactNode => {
  if(props.type === PopUpContentRowType.COLOURED_PILL_LIST) {
    return <PopUpContentColouredPillListRow {...props} />
  }

  if(props.type === PopUpContentRowType.DATE_RANGE) {
    return <PopUpContentDateRangeRow {...props} />
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

