import {
  GenericPopUpContentRow,
  PopUpContentRowBaseProps,
  PopUpContentRowRibbonConfiguration,
  PopUpContentRowType,
  PopupContentTextAlignment
} from "../pop-up-content-rows";

export type PopUpContentNumberRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.NUMBER,
  value: number;
  contentTextAlignment?: PopupContentTextAlignment;
  ribbonConfiguration?: PopUpContentRowRibbonConfiguration;
}

export const PopUpContentNumberRow = (props: PopUpContentNumberRowProps) => (
  <GenericPopUpContentRow
    title={props.title}
    textAlignment={props.contentTextAlignment}
    content={props.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
    bottomPaddingEnabled={props.bottomPaddingEnabled}
    rightPaddingEnabled={props.rightPaddingEnabled}
    contentBolded={props.contentBolded}
    ribbonConfiguration={props.ribbonConfiguration}
  />
)