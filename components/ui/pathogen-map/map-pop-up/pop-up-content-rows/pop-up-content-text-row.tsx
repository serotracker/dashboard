import { GenericPopUpContentRow, PopUpContentRowBaseProps, PopUpContentRowType } from "../pop-up-content-rows";

export type PopUpContentTextRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.TEXT,
  text: string;
}

export const PopUpContentTextRow = (props: PopUpContentTextRowProps) => (
  <GenericPopUpContentRow
    title={props.title}
    content={props.text}
  />
)