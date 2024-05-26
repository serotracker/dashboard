import { GenericPopUpContentRow, PopUpContentRowBaseProps, PopUpContentRowType } from "../pop-up-content-rows";

export type PopUpContentNumberRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.NUMBER,
  value: number;
}

export const PopUpContentNumberRow = (props: PopUpContentNumberRowProps) => (
  <GenericPopUpContentRow
    title={props.title}
    content={props.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
  />
)