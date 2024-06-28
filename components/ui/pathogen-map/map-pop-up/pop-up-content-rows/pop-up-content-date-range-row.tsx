import { useMemo } from "react";
import {
  GenericPopUpContentRow,
  PopUpContentRowBaseProps,
  PopUpContentRowType,
  PopupContentTextAlignment
} from "../pop-up-content-rows";
import { formatDateForPopUpContent } from "./pop-up-content-date-row";

export type PopUpContentDateRangeRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.DATE_RANGE,
  dateRangeStart: Date | undefined;
  dateRangeEnd: Date | undefined;
  contentTextAlignment?: PopupContentTextAlignment;
}

export const PopUpContentDateRangeRow = (props: PopUpContentDateRangeRowProps) => {
  const { dateRangeStart, dateRangeEnd } = props;

  const content = useMemo(() => {
    if(dateRangeStart && dateRangeEnd) {
      return `${formatDateForPopUpContent(dateRangeStart)} to ${formatDateForPopUpContent(dateRangeEnd)}`
    }

    if(dateRangeStart && !dateRangeEnd) {
      return `${formatDateForPopUpContent(dateRangeStart)} to an unspecified date`
    }

    if(!dateRangeStart && dateRangeEnd) {
      return `an unspecified date - ${formatDateForPopUpContent(dateRangeEnd)}`
    }

    return "-"
  }, [dateRangeStart, dateRangeEnd]);

  return (
    <GenericPopUpContentRow
      title={props.title}
      textAlignment={props.contentTextAlignment}
      content={content}
      bottomPaddingEnabled={props.bottomPaddingEnabled}
      rightPaddingEnabled={props.rightPaddingEnabled}
      contentBolded={props.contentBolded}
      ribbonConfiguration={undefined}
    />
  )
}