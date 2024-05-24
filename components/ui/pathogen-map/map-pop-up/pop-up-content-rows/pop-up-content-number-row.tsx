import {
  GenericPopUpContentRow,
  PopUpContentRowBaseProps,
  PopUpContentRowType,
  PopupContentTextAlignment
} from "../pop-up-content-rows";

export type PopUpContentNumberRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.NUMBER,
  value: number;
  contentTextAlignment?: PopupContentTextAlignment;
  ribbonConfiguration?: {
    ribbonColourClassname: string
  }
}

export const PopUpContentNumberRow = (props: PopUpContentNumberRowProps) => (
  <GenericPopUpContentRow
    title={props.title}
    textAlignment={props.contentTextAlignment}
    content={props.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
    paddingEnabled={props.paddingEnabled}
    contentBolded={props.contentBolded}
  />
)