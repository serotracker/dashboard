import { useMemo } from "react";
import { GenericPopUpContentRow, PopUpContentRowBaseProps, PopUpContentRowType } from "../pop-up-content-rows";

export type PopUpContentDateRangeRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.DATE_RANGE,
  dateRangeStart: Date | undefined;
  dateRangeEnd: Date | undefined;
}

const dateTimeFormat = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const formatDate = (date: Date) => {
  return dateTimeFormat.format(date);
}

export const PopUpContentDateRangeRow = (props: PopUpContentDateRangeRowProps) => {
  const { dateRangeStart, dateRangeEnd } = props;

  const content = useMemo(() => {
    if(dateRangeStart && dateRangeEnd) {
      return `${formatDate(dateRangeStart)} to ${formatDate(dateRangeEnd)}`
    }

    if(dateRangeStart && !dateRangeEnd) {
      return `${formatDate(dateRangeStart)} to an unspecified date`
    }

    if(!dateRangeStart && dateRangeEnd) {
      return `an unspecified date - ${formatDate(dateRangeEnd)}`
    }

    return "-"
  }, [dateRangeStart, dateRangeEnd]);

  return (
    <GenericPopUpContentRow
      title={props.title}
      content={content}
    />
  )
}