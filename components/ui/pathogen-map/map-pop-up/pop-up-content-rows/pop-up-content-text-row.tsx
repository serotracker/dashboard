import {
  GenericPopUpContentRow,
  PopUpContentRowBaseProps,
  PopUpContentRowType,
  PopupContentTextAlignment
} from "../pop-up-content-rows";

export type PopUpContentTextRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.TEXT,
  text: string;
  contentTextAlignment?: PopupContentTextAlignment;
}

export const PopUpContentTextRow = (props: PopUpContentTextRowProps) => (
  <GenericPopUpContentRow
    title={props.title}
    textAlignment={props.contentTextAlignment}
    content={props.text}
    bottomPaddingEnabled={props.bottomPaddingEnabled}
    rightPaddingEnabled={props.rightPaddingEnabled}
    contentBolded={props.contentBolded}
    ribbonConfiguration={undefined}
  />
)