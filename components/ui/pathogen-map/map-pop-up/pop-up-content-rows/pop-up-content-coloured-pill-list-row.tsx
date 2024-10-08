import { useMemo } from "react";
import {
  GenericPopUpContentRow,
  PopUpContentRowBaseProps,
  PopUpContentRowType,
  PopupContentTextAlignment
} from "../pop-up-content-rows";
import { cn } from "@/lib/utils";

export type PopUpContentColouredPillListRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.COLOURED_PILL_LIST,
  values: string[];
  contentTextAlignment?: PopupContentTextAlignment;
  valueToColourClassnameMap: Record<string, string | undefined>;
  valueToLabelMap?: Record<string, string | undefined>;
  defaultColourClassname: string;
}

export const PopUpContentColouredPillListRow = (props: PopUpContentColouredPillListRowProps) => {
  const { values, valueToColourClassnameMap, defaultColourClassname, valueToLabelMap } = props;

  const content = useMemo(() => {
    if(!Array.isArray(values)) {
      return <div className="text-md"> Not reported </div>
    }

    return values.map((value) => (
      <span key={value} className={cn(
        valueToColourClassnameMap[value] ?? defaultColourClassname,
        'mr-1 px-1 py-1 mb-1 rounded-sm inline-block',
      )}>
        {valueToLabelMap?.[value] ? valueToLabelMap[value] : value}
      </span>
    ))
  }, [values, valueToColourClassnameMap, defaultColourClassname, valueToLabelMap])

  return (
    <GenericPopUpContentRow
      title={props.title}
      textAlignment={props.contentTextAlignment}
      content={<> {content} </>}
      bottomPaddingEnabled={props.bottomPaddingEnabled}
      rightPaddingEnabled={props.rightPaddingEnabled}
      contentBolded={props.contentBolded}
      ribbonConfiguration={undefined}
    />
  );
}