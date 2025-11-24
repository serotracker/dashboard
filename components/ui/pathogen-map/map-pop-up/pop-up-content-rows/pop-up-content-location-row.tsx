import { useMemo } from "react";
import {
  GenericPopUpContentRow,
  PopUpContentRowBaseProps,
  PopUpContentRowType,
  PopupContentTextAlignment
} from "../pop-up-content-rows";

export type PopUpContentLocationRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.LOCATION,
  cityName: string | undefined;
  stateName: string | undefined;
  districtName: string | undefined;
  countryName: string;
  contentTextAlignment?: PopupContentTextAlignment;
}

export const PopUpContentLocationRow = (props: PopUpContentLocationRowProps) => {
  const { cityName, districtName, stateName, countryName } = props;

  const content = useMemo(() => {
    if(cityName && stateName) {
      return `${cityName.trim()}, ${stateName.trim()}, ${countryName.trim()}`
    }

    if(districtName && stateName) {
      return `${districtName.trim()}, ${stateName.trim()}, ${countryName.trim()}`
    }

    if(cityName && !stateName) {
      return `${cityName.trim()}, ${countryName.trim()}`
    }

    if(districtName && !stateName) {
      return `${districtName.trim()}, ${countryName.trim()}`
    }

    if(!cityName && stateName) {
      return `${stateName.trim()}, ${countryName.trim()}`
    }

    return `${countryName.trim()}`
  }, [cityName, districtName, stateName, countryName]);

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