import { useMemo } from "react";
import {
  GenericPopUpContentRow,
  PopUpContentRowBaseProps,
  PopUpContentRowType,
  PopupContentTextAlignment
} from "../pop-up-content-rows";

export type PopUpContentColouredPillListRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.COLOURED_PILL_LIST,
  values: string[];
  contentTextAlignment?: PopupContentTextAlignment;
  valueToColourClassnameMap: Record<string, string | undefined>;
  defaultColourClassname: string;
}

export const PopUpContentColouredPillListRow = (props: PopUpContentColouredPillListRowProps) => {
  const { values, valueToColourClassnameMap, defaultColourClassname } = props;

  const content = useMemo(() => {
    return values.map((value) => (
      <span key={value} className={`${valueToColourClassnameMap[value] ?? defaultColourClassname} mr-1 p-2 rounded-sm`}>
        {value}
      </span>
    ))
  }, [values, valueToColourClassnameMap, defaultColourClassname])

  return (
    <GenericPopUpContentRow
      title={props.title}
      textAlignment={props.contentTextAlignment}
      content={<> {content} </>}
      paddingEnabled={props.paddingEnabled}
      contentBolded={props.contentBolded}
    />
  );
}