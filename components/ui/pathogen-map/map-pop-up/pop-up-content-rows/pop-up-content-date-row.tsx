import { useMemo } from 'react';
import { GenericPopUpContentRow, PopUpContentRowBaseProps, PopUpContentRowType, PopupContentTextAlignment } from "../pop-up-content-rows";

const dateTimeFormat = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export const formatDateForPopUpContent = (date: Date) => {
  return dateTimeFormat.format(date);
}

export type PopUpContentDateRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.DATE,
  date: Date;
  contentTextAlignment?: PopupContentTextAlignment;
}

export const PopUpContentDateRow = (props: PopUpContentDateRowProps) => {
  const { date  } = props;

  const content = useMemo(() => formatDateForPopUpContent( date ), [ date ]);

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