import { useMemo } from "react";
import { GenericPopUpContentRow, PopUpContentRowBaseProps, PopUpContentRowType } from "../pop-up-content-rows";

export type PopUpContentLocationRowProps = PopUpContentRowBaseProps & {
  type: PopUpContentRowType.LOCATION,
  cityName: string | undefined;
  stateName: string | undefined;
  countryName: string;
}

export const PopUpContentLocationRow = (props: PopUpContentLocationRowProps) => {
  const { cityName, stateName, countryName } = props;

  const content = useMemo(() => {
    if(cityName && stateName) {
      return `${cityName.trim()}, ${stateName.trim()}, ${countryName.trim()}`
    }

    if(cityName && !stateName) {
      return `${cityName.trim()}, ${countryName.trim()}`
    }

    if(!cityName && stateName) {
      return `${stateName.trim()}, ${countryName.trim()}`
    }

    return `${countryName.trim()}`
  }, [cityName, stateName, countryName]);

  return (
    <GenericPopUpContentRow
      title={props.title}
      content={content}
    />
  )
}