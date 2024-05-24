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
    paddingEnabled={props.paddingEnabled}
    contentBolded={props.contentBolded}
  />
)